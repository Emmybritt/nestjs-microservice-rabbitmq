import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib';
import { Options } from 'amqplib/properties';
import { ModuleConfig } from '../module.config';
import { EXCHANGE, EXCHANGE_ROUTE, EXCHANGE_TYPE, MQ_QUEUE } from './constants';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly connectionString: string;
  private connection?: Connection;
  public channel: Channel;
  public setupComplete = false;

  constructor(
    @Optional()
    config: ModuleConfig
  ) {
    if (config) this.connectionString = config.rabbitMQ;
    this.setupComplete = false;
  }

  onModuleInit(): void {
    this.setup();
  }

  publish(
    exchange: string,
    routingKey: string,
    content: object | string | boolean | number,
    options?: Options.Publish
  ): void {
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(content)),
      options
    );
  }

  protected async bindQueues() {
    return Promise.all([
      this.channel.bindQueue(
        MQ_QUEUE.userCreated,
        EXCHANGE.apiAuth,
        EXCHANGE_ROUTE.userCreated
      ),
    ]);
  }

  private setup(): void {
    this.setupExchangesAndQueues().then(() => {
      this.setupComplete = true;
      Logger.log('RabbitMQ Worker Running', 'RabbitMQService');
    });
  }

  private async setupExchangesAndQueues(): Promise<void> {
    try {
      this.connection = await connect(this.connectionString);
      this.channel = await this.connection.createChannel();
      await this.assertExchanges();
      await this.assertQueues();
      await this.bindQueues();
      Logger.log('RabbitMQ Initialized');
    } catch (e) {
      Logger.error(e, 'RabbitMQ Init Error', 'RabbitMQService');
      throw e;
    }
  }

  private async assertExchanges() {
    return await Promise.all(
      Object.values(EXCHANGE).map((e) =>
        this.channel?.assertExchange(e, EXCHANGE_TYPE.topic, { durable: true })
      )
    );
  }

  private async assertQueues() {
    return await Promise.all(
      Object.values(MQ_QUEUE).map((q) =>
        this.channel?.assertQueue(q, { durable: true })
      )
    );
  }
}
