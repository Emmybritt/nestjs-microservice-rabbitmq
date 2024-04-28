import { USER_ROLE, RESOURCE } from '../generic';
import { FindMany } from '../query-params';

export interface User {
  _id: string;
  resourceType: RESOURCE.users;
  role: USER_ROLE;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  password: string;

  refreshToken: string;

  emailVerified?: boolean;
  lastLogin?: string | Date;

  disabled: boolean;
  disabledAt: string | Date;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateUser = Pick<
  User,
  'firstName' | 'lastName' | 'middleName' | 'password' | 'role' | 'email'
>;

export type LoginUser = Pick<CreateUser, 'email' | 'password'>;

export type UpdateUser = Partial<CreateUser>;

export type AuthUser = Omit<
  User,
  'emailVerified' | 'createdAt' | 'updatedAt' | 'password' | 'resourceType'
>;

export interface FindManyUser extends FindMany {
  _id: string[];
  role: string[];
  email: string[];
  firstName: string[];
  lastName: string[];
  middleName?: string[];
  disabled: boolean[];
}
