import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Action,
  AppAction,
  ApplicationAction,
  COLLECTIONS,
  FindOne,
  RESOURCE,
} from '@travel-booking-platform/types';
import { FilterQuery, PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreateHotel, FindManyHotel, Hotel } from '../interfaces/hotels';
import { HotelDocument } from '../schemas/hotel.schema';
import { AnyMongoAbility } from '@casl/ability';
import {
  EXCHANGE,
  EXCHANGE_ROUTE,
  RabbitMQService,
  findManyWrapper,
  findOneWrapper,
} from '@travel-booking-platform/nest';
import { accessibleBy } from '@casl/mongoose';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(COLLECTIONS.hotels)
    private hotelModel: PaginateModel<HotelDocument>,
    private rabbitMQ: RabbitMQService
  ) {}

  async create(createHotel: CreateHotel & { creator: string }) {
    return this.hotelModel.create(createHotel).then((hotel) => {
      this.rabbitMQ.publish(EXCHANGE.apiHotel, EXCHANGE_ROUTE.hotelCreated, {
        hotel,
      });
      return hotel;
    });
  }

  async delete(_id: string, ability: AnyMongoAbility) {
    const query = this.getAbilityFilters({ _id }, AppAction.delete, ability);
    return this.hotelModel.findOneAndDelete(query).then(async (hotel) => {
      if (hotel)
        this.rabbitMQ.publish(EXCHANGE.apiHotel, EXCHANGE_ROUTE.hotelDeleted, {
          hotel,
        });
      return hotel;
    });
  }

  findOne(
    filter: FilterQuery<HotelDocument>,
    findOne: FindOne = { lean: true },
    ability?: AnyMongoAbility
  ): Promise<Hotel> {
    const query = this.getAbilityFilters(filter, AppAction.view, ability);
    return findOneWrapper<HotelDocument>(
      this.hotelModel.findOne(query),
      findOne,
      RESOURCE.hotels
    );
  }

  async findMany(
    query: FindManyHotel,
    ability?: AnyMongoAbility
  ): Promise<PaginateResult<HotelDocument>> {
    return findManyWrapper<HotelDocument>(
      this.hotelModel,
      this.getFindManyFilters(query, ability),
      query
    );
  }

  async updateOne(
    filter: FilterQuery<Hotel>,
    hotel: Partial<Hotel>,
    ability: AnyMongoAbility,
    option: {
      populate?: string | string[];
      publish?: boolean;
      lean?: boolean;
    } = { publish: true }
  ) {
    const query = this.getAbilityFilters(filter, AppAction.update, ability);
    return this.hotelModel
      .findOneAndUpdate(query, hotel, {
        runValidators: true,
        new: true,
        lean: true,
        ...option,
      })
      .exec()
      .then((newHotel) => {
        if (!newHotel) {
          throw new NotFoundException('Hotel not found');
        }
        if (option.publish) {
          this.rabbitMQ.publish(
            EXCHANGE.apiHotel,
            EXCHANGE_ROUTE.hotelUpdated,
            { hotel: newHotel }
          );
        }
        return newHotel;
      });
  }

  getFindManyFilters(query: FindManyHotel, ability?: AnyMongoAbility) {
    const condition: FilterQuery<Hotel> = {};
    if (query.search) {
      condition.$or = [];
      query.search.map((search) => {
        if (Types.ObjectId.isValid(search))
          condition.$or.push({ _id: new Types.ObjectId(search) });
        else {
          const regx = new RegExp(search, 'i');
          condition.$or.push(
            { name: regx },
            { 'address.street': regx },
            { 'address.city': regx },
            { 'address.state': regx },
            { 'address.zipcode': regx },
            { 'address.country': regx }
          );
        }
      });
    }

    if (query.name) condition['name'] = { $in: query.name };
    if (query._id) condition['_id'] = { $in: query._id };

    return this.getAbilityFilters(condition, AppAction.search, ability);
  }

  private getAbilityFilters(
    filter: FilterQuery<Hotel>,
    action: Action | ApplicationAction,
    ability?: AnyMongoAbility
  ) {
    if (!ability) return filter;
    return {
      $and: [filter, accessibleBy(ability, action).ofType('Hotel')],
    };
  }
}
