import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { AuthUser } from '@travel-booking-platform/types';
import { defineHotelAbilitiesFor } from './hotel.ability';
import { defineHotelRoomAbilitiesFor } from './hotel-room.ability';
import { defineHotelRoomReservationAbilitiesFor } from './hotel-room-reservation.ability';

export const defineAbilitiesFor = (u: AuthUser) => {
  const { can, build, cannot } = new AbilityBuilder(createMongoAbility);
  defineHotelAbilitiesFor(u, can, cannot);
  defineHotelRoomAbilitiesFor(u, can, cannot);
  defineHotelRoomReservationAbilitiesFor(u, can, cannot);

  return build({
    // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
    detectSubjectType: (item) => {
      console.log(item, "itemmmm")
      return (
        item['resourceType'] || (item.constructor as ExtractSubjectType<any>)
      );
    },
  });
};
