export enum EXCHANGE {
  apiAuth = 'auth',
  apiHotel = 'hotel',
  apiFlight = 'flight',
}

export enum EXCHANGE_ROUTE {
  userCreated = 'user.created',
  userDisabled = 'user.disabled',
}

export enum EXCHANGE_TYPE {
  fanout = 'fanout',
  topic = 'topic',
  headers = 'headers',
  direct = 'direct',
}

export enum MQ_QUEUE {
  userCreated = 'user.created',
}
