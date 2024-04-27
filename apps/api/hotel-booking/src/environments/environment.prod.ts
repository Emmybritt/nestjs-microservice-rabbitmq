export const environment = {
  production: true,
  name: 'Hotel Booking Service',
  version: '1.0.0',
  basePath: process.env.BASE_PATH,
  port: +process.env.NODE_PORT || 3002,
  bearerAuth: true,
  rabbitMQ: process.env.RABBIT_MQ_URL,
  databaseURI: process.env.MONGO_DB_SRV,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_TOKEN_EXPIRE || '5m',
    refereshExpireIn: process.env.JWT_REFERESH_EXPIRE || '30 days',
    issuer:
      process.env.BASE_PATH ||
      'https://api.travel-booking-app.com/hotel-booking',
    audience: process.env.JWT_AUDIENCE || 'travel-booking-app.com',
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  sessionSecret: process.env.SESSION_SECRET,
};
