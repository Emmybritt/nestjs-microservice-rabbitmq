import { RESOURCE } from '../generic';
import { FindMany } from '../query-params';

export interface Airline {
  _id: string;
  name: string;
  resourceType: RESOURCE.airline;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateAirLine = Pick<Airline, 'name'>;

export type UpdateAirline = Partial<CreateAirLine>;

export interface FindManyAirline extends FindMany {
  _id: string[];
  name: string[];
}
