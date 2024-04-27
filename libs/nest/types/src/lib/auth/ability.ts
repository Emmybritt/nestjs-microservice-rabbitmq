import { FilterQuery } from 'mongoose';
import { RESOURCE } from '../generic';

export enum Action {
  view = 'view',
  search = 'search',
  create = 'create',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
  statusUpdate = 'statusUpdate',
  changePassword = 'changePassword',
}
export enum ApplicationAction {
  submit = 'submit',
  admit = 'admit',
  accept = 'accept',
  reject = 'reject',
  cancel = 'cancel',
}
export type AppActionType = Action | ApplicationAction;
export const AppAction = {
  ...Action,
  ...ApplicationAction,
};
export type AddRule<T> = (
  action: Action | ApplicationAction,
  resource: RESOURCE | 'all',
  prop?: FilterQuery<T>
) => void;
