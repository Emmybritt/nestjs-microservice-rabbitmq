import { User } from '../auth';
import { RESOURCE } from '../generic';
import { FindMany } from '../query-params';
import { AirCraftSeats } from './aircraft-seat';
import { Flights } from './flight';

export interface FlightBooking {
  _id: string;
  resourceType: RESOURCE.flightBooking;
  user: string | User;
  flight: string | Flights;
  seat: string | AirCraftSeats;
  booking_date: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type BookFlight = Pick<
  FlightBooking,
  'booking_date' | 'flight' | 'seat' | 'user'
>;

export type UpdateFlightBooking = Partial<Omit<BookFlight, 'user'>>;

export interface FindManyFlightBookings extends FindMany {
  user: string[];
  flight: string[];
  seat: string[];
  booking_date: string[];
}
