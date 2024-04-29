import {
  AddRule,
  AppAction,
  AuthUser,
  HotelRoom,
  RESOURCE,
  USER_ROLE,
} from '@travel-booking-platform/types';

export const defineHotelRoomAbilitiesFor = (
  u: AuthUser,
  can: AddRule<HotelRoom>,
  cannot: AddRule<HotelRoom>
) => {
  const resource = RESOURCE.hotelRoom;
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
    cannot(AppAction.delete, resource);
  }
};
