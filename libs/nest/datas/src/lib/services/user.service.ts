import { Logger } from '@nestjs/common';
import { User } from '@travel-booking-platform/types';
import { FilterQuery } from 'mongoose';
import { AnyMongoAbility } from '@casl/ability';

export class UserService {
  private logger = new Logger(UserService.name);

  // constructor() {}

  async findOne(
    query: FilterQuery<User>,
    findOne = { lean: true },
    ability?: AnyMongoAbility
  ) {
    return;
    // return findOneWrapper<UserDocument>(
    //   this.userModel.findOne(
    //     this.getAbilityFilters(query, Action.view, ability)
    //   ),
    //   findOne,
    //   'User'
    // );
  }
}
