import { RESOURCE } from '../generic';
import { FindMany } from '../query-params';

export enum AIRCRAFT_TYPE {
  helicopter = 'HELICOPTER',
  airplane = 'AIRPLANE',
  privateJet = 'PRIVATE_JET',
}
export interface Aircraft {
  _id: string;
  resourceType: RESOURCE.aircraft;
  creator: string;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateAircraft = Pick<Aircraft, 'name'>;

export type UpdateAircraft = Partial<CreateAircraft>;

export interface FindManyAirCrafts extends FindMany {
  _id: string[];
  name: string[];
}
