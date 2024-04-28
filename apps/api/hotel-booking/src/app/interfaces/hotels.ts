import { Address, FindMany, RESOURCE } from '@travel-booking-platform/types';

export interface Hotel {
  _id: string;
  resourceType: RESOURCE.hotels;
  name: string;
  address: Address;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateHotel = Omit<
  Hotel,
  '_id' | 'createdAt' | 'updatedAt' | 'resourceType'
>;

export type UpdateHotel = Partial<CreateHotel>;

export interface FindManyHotel extends FindMany {
  name: string[];
  _id: string[];
}
