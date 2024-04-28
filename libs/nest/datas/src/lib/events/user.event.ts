import { UpdateUser, User } from '@travel-booking-platform/types';

export class UserCreatedEvent {
  constructor(public readonly user: User) {}
}

export class UserUpdatedEvent {
  constructor(
    public readonly user: User,
    public readonly updateUser: UpdateUser
  ) {}
}

export class UserDeletedEvent {
  constructor(public readonly user: User) {}
}
