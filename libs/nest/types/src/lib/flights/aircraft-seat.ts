import { RESOURCE } from '../generic';
import { FindMany } from '../query-params';

export enum SEATS_CLASS {
  economy = 'ECONOMY',
  business = 'BUSINESS',
  first = 'FIRST',
}

export interface AirCraftSeats {
  _id: string;
  resourceType: RESOURCE.airCraftSeat;
  aircraft: string;
  seat_number: string;
  class: SEATS_CLASS;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type RegisterAirCraftSeats = Pick<
  AirCraftSeats,
  'aircraft' | 'class' | 'seat_number'
>;

export type UpdateAircraftSeats = Partial<RegisterAirCraftSeats>;

export interface FindManyAircraftSeats extends FindMany {
  _id: string[];
  seat_number: string[];
  class: string[];
  aircraft: string[];
}
