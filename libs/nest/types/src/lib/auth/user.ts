export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  password?: string;

  emailVerified?: boolean;
  lastLogin?: string | Date;

  disabled: boolean;
  disabledAt: string | Date;

  createdAt: string | Date;
  updatedAt: string | Date;
}

export type AuthUser = Omit<
  User,
  'emailVerified' | 'createdAt' | 'updatedAt' | 'password'
>;
