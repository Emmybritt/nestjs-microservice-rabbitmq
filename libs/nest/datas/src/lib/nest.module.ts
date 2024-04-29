import { HttpModule } from '@nestjs/axios';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { redisStore } from 'cache-manager-redis-store';
import { LoginAuthGuard } from './guards/auth.guard';
import { HealthModule } from './health/health.module';
import { ObjectIdInterceptor } from './interceptors';
import { ModuleConfig } from './module.config';
import { RabbitMQService } from './rabbitmq';

import { RedisClientOptions } from 'redis';

import { ConfigModule } from '@nestjs/config';
import { COLLECTIONS } from '@travel-booking-platform/types';
import { Environment } from './boostrap';
import { CaslAbilityGuard } from './guards';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './services';
import { JwtStrategy, SessionSerializer } from './strategies';
import { ExistsValidator } from './validators';
import { AbilityFactory } from './abilities';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COLLECTIONS.users, schema: UserSchema },
    ]),
    HealthModule,
    ConfigModule.forRoot(),
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
  ],
  exports: [MongooseModule, RabbitMQService, UserService, AbilityFactory],
  providers: [
    RabbitMQService,
    UserService,
    AbilityFactory,

    ExistsValidator,
    //Strategies
    JwtStrategy,
    SessionSerializer,

    {
      provide: APP_INTERCEPTOR,
      useClass: ObjectIdInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: LoginAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CaslAbilityGuard,
    },
  ],
})
export class NestDataModule {
  public static forRoot(env: Environment): DynamicModule {
    return {
      module: NestDataModule,
      providers: [{ provide: ModuleConfig, useValue: new ModuleConfig(env) }],
      imports: [
        CacheModule.registerAsync<RedisClientOptions>({
          useFactory: async () => {
            const store: CacheStore = (await redisStore({
              socket: {
                host: env.redis.host,
                port: env.redis.port,
                passphrase: env.redis.password,
              },
              password: env.redis.password,
              ttl: 1500,
            })) as unknown as CacheStore;
            return {
              store,
            };
          },
          isGlobal: true,
        }),
        JwtModule.register({
          secret: env.jwt.secret,
          signOptions: {
            expiresIn: env.jwt.expiresIn,
            audience: env.jwt.audience,
            issuer: env.jwt.issuer,
          },
        }),
      ],
      exports: [JwtModule],
      global: true,
    };
  }
}
