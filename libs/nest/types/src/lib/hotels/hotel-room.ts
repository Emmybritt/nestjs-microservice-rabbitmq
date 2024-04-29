import { RESOURCE } from '../generic';
import { FindMany } from '../query-params';

export enum ROOM_TYPE {
  single = 'SINGLE',
  double = 'DOUBLE',
  suite = 'SUITE',
}
export interface HotelRoom {
  _id: string;
  resourceType: RESOURCE.hotelRoom;
  creator: string;
  hotel: string;
  room_number: string;
  room_type: ROOM_TYPE;
  capacity: string;
  is_available: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateHotelRoom = Omit<
  HotelRoom,
  '_id' | 'resourceType' | 'createdAt' | 'updatedAt' | 'creator'
>;

export type UpdateHotelRoom = Partial<CreateHotelRoom>;

export interface FindManyHotelRoom extends FindMany {
  _id: string[];
  hotel: string[];
  room_type: ROOM_TYPE[];
}
