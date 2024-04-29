import {
  AddRule,
  AppAction,
  AuthUser,
  HotelRoomReservation,
  RESOURCE,
  USER_ROLE,
} from '@travel-booking-platform/types';

export const defineHotelRoomReservationAbilitiesFor = (
  u: AuthUser,
  can: AddRule<HotelRoomReservation>,
  cannot: AddRule<HotelRoomReservation>
) => {
  const resource = RESOURCE.hotelRoomReservation;
  if (
    [USER_ROLE.admin, USER_ROLE.editor, USER_ROLE.superAdmin].includes(u.role)
  ) {
    can(AppAction.create, resource);
    can(AppAction.delete, resource);
    can(AppAction.manage, resource);
    can(AppAction.update, resource);
    can(AppAction.view, resource);
    can(AppAction.search, resource);
  } else {
    can(AppAction.view, resource);
    can(AppAction.search, resource);
    cannot(AppAction.delete, resource, { user: u._id });
    can(AppAction.update, resource, { user: u._id });
  }
};
