import { Address, RESOURCE } from '../generic';
import { FindMany } from '../query-params';

export interface Airports {
  _id: string;
  resourceType: RESOURCE.airport;
  creator: string;
  name: string;
  address: Address;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateAirport = Pick<Airports, 'name' | 'address'>;

export type UpdateAirport = Partial<CreateAirport>;

export interface FindManyAirports extends FindMany {
  _id: string[];
  name: string[];
}
