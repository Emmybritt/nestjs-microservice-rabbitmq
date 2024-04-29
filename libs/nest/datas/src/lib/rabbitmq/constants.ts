export enum EXCHANGE {
  apiAuth = 'auth',
  apiHotel = 'hotel',
  apiFlight = 'flight',
}

export enum EXCHANGE_ROUTE {
  userCreated = 'user.created',
  userDisabled = 'user.disabled',
  hotelDeleted = 'hotel.deleted',
  hotelCreated = 'hotel.created',
  hotelUpdated = 'hotel.updated',
  hotelRoomCreated = 'hotel.room.created',
  hotelRoomDeleted = 'hotel.room.deleted',
  hotelRoomUpdated = 'hotel.room.updated',
  hotelRoomReservationDeleted = 'hotel.room.reservation.deleted',
  hotelRoomReservationCreated = 'hotel.room.reservation.created',
}

export enum EXCHANGE_TYPE {
  fanout = 'fanout',
  topic = 'topic',
  headers = 'headers',
  direct = 'direct',
}

export enum MQ_QUEUE {
  userCreated = 'user.created',
  hotelRoomReservationCreated = 'hotel-room.reservation.created',
}
