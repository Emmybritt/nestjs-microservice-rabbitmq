import { AnyMongoAbility } from '@casl/ability';
import { accessibleBy } from '@casl/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EXCHANGE,
  EXCHANGE_ROUTE,
  RabbitMQService,
  findManyWrapper,
  findOneWrapper,
} from '@travel-booking-platform/nest';
import {
  Action,
  AppAction,
  ApplicationAction,
  COLLECTIONS,
  FindOne,
  RESOURCE,
} from '@travel-booking-platform/types';
import { FilterQuery, PaginateModel, PaginateResult } from 'mongoose';
import {
  CreateRoomHotelReservation,
  FindManyHotelRoomReservations,
  HotelRoomReservation,
} from '../interfaces/hotel-room-reservation';
import { HotelRoomReservationDocument } from '../schemas/hotel-room-reservation.schema';
import { HotelRoomService } from './hotel-room.service';

@Injectable()
export class HotelRoomReservationService {
  constructor(
    @InjectModel(COLLECTIONS.hotelRooms)
    private hotelRoomReservationModel: PaginateModel<HotelRoomReservationDocument>,
    private roomService: HotelRoomService,
    private rabbitMQ: RabbitMQService
  ) {}

  async create(
    createRoomReservation: CreateRoomHotelReservation & { user: string }
  ) {
    const [roomExist] = await Promise.all([
      this.roomService.findOne({
        _id: createRoomReservation.room,
      }),
    ]);

    if (!roomExist) {
      throw new BadRequestException('Hotel room not found');
    }
    if (!roomExist.is_available) {
      throw new BadRequestException('Hotel room not available at the moment');
    }
    return this.hotelRoomReservationModel
      .create(createRoomReservation)
      .then((hotelRoomModel) => {
        this.rabbitMQ.publish(
          EXCHANGE.apiHotel,
          EXCHANGE_ROUTE.hotelRoomCreated,
          {
            hotelRoomModel,
          }
        );
        return hotelRoomModel;
      });
  }

  async update(
    filter: FilterQuery<HotelRoomReservation>,
    hotelRoomReservation: Partial<HotelRoomReservation>,
    ability?: AnyMongoAbility,
    option: {
      populate?: string | string[];
      publish?: boolean;
      lean?: boolean;
    } = { publish: true }
  ): Promise<HotelRoomReservation> {
    const query = this.getAbilityFilters(filter, AppAction.update, ability);
    return this.hotelRoomReservationModel
      .findOneAndUpdate(query, hotelRoomReservation, {
        runValidators: true,
        lean: true,
        new: true,
        ...option,
      })
      .then((reservations) => {
        this.rabbitMQ.publish(
          EXCHANGE.apiHotel,
          EXCHANGE_ROUTE.hotelRoomReservationUpdated,
          {
            reservations,
          }
        );
        return reservations;
      });
  }

  async delete(_id: string, ability: AnyMongoAbility) {
    const query = this.getAbilityFilters({ _id }, AppAction.delete, ability);
    return this.hotelRoomReservationModel
      .findOneAndDelete(query)
      .then(async (hotelRoomReservation) => {
        if (hotelRoomReservation)
          this.rabbitMQ.publish(
            EXCHANGE.apiHotel,
            EXCHANGE_ROUTE.hotelRoomReservationDeleted,
            {
              hotelRoomReservation,
            }
          );
        return hotelRoomReservation;
      });
  }

  findOne(
    filter: FilterQuery<HotelRoomReservationDocument>,
    findOne: FindOne = { lean: true },
    ability?: AnyMongoAbility
  ): Promise<HotelRoomReservation> {
    const query = this.getAbilityFilters(filter, AppAction.view, ability);
    return findOneWrapper<HotelRoomReservationDocument>(
      this.hotelRoomReservationModel.findOne(query),
      findOne,
      RESOURCE.hotelRoomReservation
    );
  }

  async findMany(
    query: FindManyHotelRoomReservations,
    ability?: AnyMongoAbility
  ): Promise<PaginateResult<HotelRoomReservation>> {
    return findManyWrapper<HotelRoomReservationDocument>(
      this.hotelRoomReservationModel,
      this.getFindManyFilters(query, ability),
      query
    );
  }

  getFindManyFilters(
    query: FindManyHotelRoomReservations,
    ability?: AnyMongoAbility
  ) {
    const condition: FilterQuery<HotelRoomReservation> = {};

    if (query.check_in_date)
      condition['check_in_date'] = { $in: query.check_in_date };
    if (query.is_confirmed)
      condition['is_confirmed'] = { $in: query.is_confirmed };
    if (query.reservation_date)
      condition['reservation_date'] = { $in: query.reservation_date };

    return this.getAbilityFilters(condition, AppAction.search, ability);
  }

  private getAbilityFilters(
    filter: FilterQuery<HotelRoomReservation>,
    action: Action | ApplicationAction,
    ability?: AnyMongoAbility
  ) {
    if (!ability) return filter;
    return {
      $and: [
        filter,
        accessibleBy(ability, action).ofType(RESOURCE.hotelRoomReservation),
      ],
    };
  }
}
