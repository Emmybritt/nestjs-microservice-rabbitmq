import { RESOURCE } from '../generic';
import { FindMany } from '../query-params';
import { Airline } from './airline';
import { Airports } from './airport';

export interface Flights {
  _id: string;
  resourceType: RESOURCE.flight;
  airline: string | Airline;
  depature_airport: string | Airports; //depature airport
  arrival_airport: string | Airports; // arrival airport
  depature_datetime: string | Date;
  arrival_datetime: string | Date;
  flight_duration: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateFlight = Pick<
  Flights,
  | 'airline'
  | 'arrival_airport'
  | 'depature_airport'
  | 'arrival_datetime'
  | 'depature_datetime'
  | 'flight_duration'
>;

export type UpdateFlight = Partial<CreateFlight>;

export interface FindManyFlights extends FindMany {
  airline: string[];
  depature_airport: string[];
  depature_datetime: string[];
  flight_duration: string[];
}
