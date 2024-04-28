import { AnyMongoAbility } from '@casl/ability';
import { accessibleBy } from '@casl/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Action,
  AppAction,
  COLLECTIONS,
  CreateUser,
  FindManyUser,
  FindOne,
  User,
} from '@travel-booking-platform/types';
import { FilterQuery, PaginateModel, Types } from 'mongoose';
import { UserCreatedEvent } from '../events';
import {
  HelperClassService,
  findManyWrapper,
  findOneWrapper,
} from '../helpers';
import { EXCHANGE, EXCHANGE_ROUTE, RabbitMQService } from '../rabbitmq';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService extends HelperClassService {
  private logger = new Logger(UserService.name);

  constructor(
    private mqService: RabbitMQService,
    @InjectModel(COLLECTIONS.users)
    private userModel: PaginateModel<UserDocument>,
    private rabbitMq: RabbitMQService
  ) {
    super();
  }

  async create(createUser: CreateUser): Promise<User> {
    const password = await this.hashData(createUser.password);
    return this.userModel
      .create({ ...createUser, password })
      .then(async (user) => {
        this.rabbitMq.publish(
          EXCHANGE.apiAuth,
          EXCHANGE_ROUTE.userCreated,
          new UserCreatedEvent(user)
        );
        return user;
      });
  }

  find(query: FindManyUser, ability: AnyMongoAbility) {
    const filters: FilterQuery<User> = this.getFindManyFilters(query, ability);
    return findManyWrapper<UserDocument>(this.userModel, filters, query);
  }

  private getFindManyFilters(query: FindManyUser, ability: AnyMongoAbility) {
    const filters: FilterQuery<User> = {};

    if (query.search) {
      filters.$or = [];
      query.search.forEach((search) => {
        if (Types.ObjectId.isValid(search)) filters.$or?.push({ _id: search });
        else {
          const regx = new RegExp(search, 'i');
          filters.$or?.push(
            { firstName: regx },
            { lastName: regx },
            { middleName: regx },
            { email: regx }
          );
        }
      });
    }

    if (query.email) filters['email'] = { $in: query.email };
    if (query.firstName) filters['firstName'] = { $in: query.firstName };
    if (query.lastName) filters['lastName'] = { $in: query.lastName };
    if (query.middleName) filters['middleName'] = { $in: query.middleName };
    if (query.role) filters['role'] = { $in: query.role };
    if (query.disabled) filters['disabled'] = { $in: query.disabled };

    return this.getAbilityFilters(filters, Action.search, ability);
  }

  async findOne(
    query: FilterQuery<UserDocument>,
    findOne: FindOne = { lean: true },
    ability?: AnyMongoAbility
  ): Promise<User> {
    return findOneWrapper(
      this.userModel.findOne(
        this.getAbilityFilters(query, Action.view, ability)
      ),
      findOne,
      'Users'
    );
  }

  async disable(_id: string, ability: AnyMongoAbility) {
    const filter = this.getAbilityFilters({ _id }, Action.delete, ability);
    return await this.userModel
      .findOneAndUpdate(
        filter,
        { $set: { disabled: true, disabledAt: new Date() } },
        { new: true, runValidators: true }
      )
      .exec()
      .then((user) => {
        user &&
          this.mqService.publish(
            EXCHANGE.apiAuth,
            EXCHANGE_ROUTE.userDisabled,
            user
          );
      });
  }

  async update(
    filter: FilterQuery<User>,
    user: Partial<User>,
    ability?: AnyMongoAbility,
    option: {
      populate?: string | string[];
      publish?: boolean;
      lean?: boolean;
    } = { publish: true }
  ) {
    const query = this.getAbilityFilters(filter, AppAction.update, ability);
    return this.userModel
      .findOneAndUpdate(query, user, {
        runValidators: true,
        lean: true,
        new: true,
        ...option,
      })
      .exec();
  }

  private getAbilityFilters(
    filter: FilterQuery<User>,
    action: Action,
    ability?: AnyMongoAbility
  ) {
    if (!ability) return filter;
    return {
      $and: [filter, accessibleBy(ability, action).ofType('User')],
    };
  }
}
