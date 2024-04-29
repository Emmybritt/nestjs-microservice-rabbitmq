import {
  AddRule,
  AppAction,
  AuthUser,
  Hotel,
  RESOURCE,
  USER_ROLE,
} from '@travel-booking-platform/types';

export const defineHotelAbilitiesFor = (
  u: AuthUser,
  can: AddRule<Hotel>,
  cannot: AddRule<Hotel>
) => {
  const resource = RESOURCE.hotels;
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
