/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as compression from 'compression';
import {
  AllExceptionFilter,
  HttpExceptionFilter,
  MongoExceptionFilter,
} from '../filters';
import { bootstrapSwagger } from './util-swagger';
// import helmet from '@fastify/helmet';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { useContainer } from 'class-validator';
import RedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { Redis, RedisOptions } from 'ioredis';
import * as passport from 'passport';
import { mw as RequestIp } from 'request-ip';
import { AbilitiesMiddleware } from '../middlewares/abilities.middleware';

export interface Environment {
  production: boolean;
  name: string;
  version: string;
  basePath: string;
  port: number;
  bearerAuth?: boolean;
  redis: RedisOptions;
  rabbitMQ: string;
  jwt: JwtModuleOptions & JwtSignOptions;
  sessionSecret?: string;
}

export async function bootstrapNestApp<T>(
  AppModule: T,
  environment: Environment,
  useExpress = true
) {
  const logger = new Logger(environment.name);

  const app = useExpress
    ? await NestFactory.create(AppModule)
    : await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({ bodyLimit: 256 * 100000 })
      );

  if (useExpress) {
    const redisClient = new Redis(environment.redis);

    redisClient.on('connect', () => {
      logger.log('Redis database connected');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Error:', err);
    });
    const store: any = new RedisStore({
      client: redisClient,
      prefix: `session:`,
      ttl: 60 * 60 * 24 * 180, // 180 days
    });

    if (environment.sessionSecret) {
      app.use(cookieParser());
      app.use(
        session({
          secret: environment.sessionSecret,
          resave: false,
          saveUninitialized: false,
          store: store,
          cookie: { secure: false }, // Set secure to true if you are using HTTPS
        })
      );
    }
    app.use(passport.session());
  }
  app.use(AbilitiesMiddleware);
  app.use(RequestIp());

  addValidatitors(app);

  addErrorFilters(app);
  useContainer(app.select(AppModule as any), { fallbackOnErrors: true });

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  const swaggerEndpoint = 'api';
  bootstrapSwagger(app, {
    title: environment.name,
    description: environment.name + ' Api',
    version: environment.version,
    endpoint: swaggerEndpoint,
    bearerAuth: environment.bearerAuth,
    basePath: environment.basePath,
  });

  const port = environment.port;
  const allowedOrigins = [environment.basePath];
  if (!environment.production) {
    allowedOrigins.push();
  }
  app.enableCors({
    credentials: true,
    origin: allowedOrigins,
  });
  app.use(compression());
  // await app.register(helmet);

  await app.listen(port, '0.0.0.0', async () => {
    logger.log(`Server Listening at ${await app.getUrl()}`);
    logger.log(
      `Swagger Doc Listening at ${await app.getUrl()}/${swaggerEndpoint}`
    );
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error({
      message: 'Unhandled Rejection at:',
      reason: `${reason}`,
    });
    console.error(promise);
    // Application specific logging, throwing an error, or other logic here
  });

  return app;
}
export const addValidatitors = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
};
export const addErrorFilters = (app: INestApplication) => {
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
};
