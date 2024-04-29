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
  CreateHotelRoom,
  FindManyHotelRoom,
  FindOne,
  HotelRoom,
  RESOURCE,
} from '@travel-booking-platform/types';
import { FilterQuery, PaginateModel, PaginateResult, Types } from 'mongoose';
import { HotelRoomDocument } from '../schemas/hotel-room.schema';
import { HotelService } from './hotel.service';

@Injectable()
export class HotelRoomService {
  constructor(
    @InjectModel(COLLECTIONS.hotelRooms)
    private hotelRoomModel: PaginateModel<HotelRoomDocument>,
    private hotelService: HotelService,
    private rabbitMQ: RabbitMQService
  ) {}

  async create(createHotelRoom: CreateHotelRoom & { creator: string }) {
    const hotelExist = await this.hotelService.findOne({
      _id: createHotelRoom.hotel,
    });
    if (!hotelExist) {
      throw new BadRequestException('Hotel not found');
    }
    return this.hotelRoomModel.create(createHotelRoom).then((hotelRoom) => {
      this.rabbitMQ.publish(
        EXCHANGE.apiHotel,
        EXCHANGE_ROUTE.hotelRoomCreated,
        {
          hotelRoom,
        }
      );
      return hotelRoom;
    });
  }

  async delete(_id: string, ability: AnyMongoAbility) {
    const query = this.getAbilityFilters({ _id }, AppAction.delete, ability);
    return this.hotelRoomModel.findOneAndDelete(query).then(async (hotel) => {
      if (hotel)
        this.rabbitMQ.publish(
          EXCHANGE.apiHotel,
          EXCHANGE_ROUTE.hotelRoomDeleted,
          {
            hotel,
          }
        );
      return hotel;
    });
  }

  findOne(
    filter: FilterQuery<HotelRoomDocument>,
    findOne: FindOne = { lean: true },
    ability?: AnyMongoAbility
  ): Promise<HotelRoom> {
    const query = this.getAbilityFilters(filter, AppAction.view, ability);
    return findOneWrapper<HotelRoomDocument>(
      this.hotelRoomModel.findOne(query),
      findOne,
      RESOURCE.hotelRoom
    );
  }

  async findMany(
    query: FindManyHotelRoom,
    ability?: AnyMongoAbility
  ): Promise<PaginateResult<HotelRoomDocument>> {
    return findManyWrapper<HotelRoomDocument>(
      this.hotelRoomModel,
      this.getFindManyFilters(query, ability),
      query
    );
  }

  getFindManyFilters(query: FindManyHotelRoom, ability?: AnyMongoAbility) {
    const condition: FilterQuery<HotelRoom> = {};
    if (query.search) {
      condition.$or = [];
      query.search.map((search) => {
        if (Types.ObjectId.isValid(search))
          condition.$or.push({ _id: new Types.ObjectId(search) });
        else {
          const regx = new RegExp(search, 'i');
          condition.$or.push({ room_type: regx }, { room_number: regx });
        }
      });
    }

    if (query.hotel) condition['hotel'] = { $in: query.hotel };
    if (query._id) condition['_id'] = { $in: query._id };
    if (query.room_type) condition['room_type'] = { $in: query.room_type };

    return this.getAbilityFilters(condition, AppAction.search, ability);
  }

  async update(
    filter: FilterQuery<HotelRoom>,
    hotelRoom: Partial<HotelRoom>,
    ability?: AnyMongoAbility,
    option: {
      populate?: string | string[];
      publish?: boolean;
      lean?: boolean;
    } = { publish: true }
  ): Promise<HotelRoom> {
    const query = this.getAbilityFilters(filter, AppAction.update, ability);
    return this.hotelRoomModel
      .findOneAndUpdate(query, hotelRoom, {
        runValidators: true,
        lean: true,
        new: true,
        ...option,
      })
      .then((hotelRoom) => {
        this.rabbitMQ.publish(
          EXCHANGE.apiHotel,
          EXCHANGE_ROUTE.hotelRoomUpdated,
          {
            hotelRoom,
          }
        );
        return hotelRoom;
      });
  }

  private getAbilityFilters(
    filter: FilterQuery<HotelRoom>,
    action: Action | ApplicationAction,
    ability?: AnyMongoAbility
  ) {
    if (!ability) return filter;
    return {
      $and: [filter, accessibleBy(ability, action).ofType(RESOURCE.hotelRoom)],
    };
  }
}
