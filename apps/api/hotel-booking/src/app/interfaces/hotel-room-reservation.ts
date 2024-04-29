import { FindMany, RESOURCE } from '@travel-booking-platform/types';

export interface HotelRoomReservation {
  _id: string;
  resourceType: RESOURCE.hotelRoomReservation;
  user: string;
  room: string;
  check_in_date: string | Date;
  reservation_date: string | Date;
  is_confirmed: boolean;
  updatedAt: string | boolean;
}

export type CreateRoomHotelReservation = Pick<
  HotelRoomReservation,
  'check_in_date' | 'room' | 'is_confirmed'
>;

export type UpdateHotelReservation = Partial<
  Omit<HotelRoomReservation, 'updatedAt' | 'resourceType' | '_id'>
>;

export interface FindManyHotelRoomReservations extends FindMany {
  _id: string[];
  user: string[];
  room: string[];
  check_in_date: string[];
  reservation_date: string[];
  is_confirmed: boolean[];
}
