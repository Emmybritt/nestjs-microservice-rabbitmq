import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { RedisOptions } from 'ioredis';
import { Environment } from './boostrap';
@Injectable()
export class ModuleConfig {
  redis!: RedisOptions;
  rabbitMQ!: string;
  jwt!: JwtModuleOptions & JwtSignOptions;
  constructor(env: Environment) {
    Object.assign(this, env);
  }
}
