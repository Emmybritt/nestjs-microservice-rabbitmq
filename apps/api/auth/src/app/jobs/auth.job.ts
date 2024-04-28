import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MQ_QUEUE, RabbitMQService } from '@travel-booking-platform/nest';
import { Channel } from 'amqplib';

@Injectable()
export class AuthJob implements OnModuleInit {
  private readonly logger: Logger;
  private interval: NodeJS.Timeout;
  private channel: Channel;
  constructor(private mqService: RabbitMQService) {
    this.logger = new Logger('ApplicationQJob');
  }

  onModuleInit() {
    this.interval = setInterval(() => {
      this.logger.log('Waiting RabbitMQ Service');
      this.run();
    }, 1000);
  }

  private run(): void {
    if (this.mqService?.setupComplete) {
      clearInterval(this.interval);
      this.logger.log('Processing RabbitMQ Service');
      this.channel = this.mqService.channel;
      this.processAuthUserCreated();
    }
  }

  private processAuthUserCreated(): void {
    this.channel.consume(MQ_QUEUE.userCreated, async (msg) => {
      if (msg && msg.content) {
        console.log(
          'This is the message from the auth job',
          JSON.parse(msg.content.toString())
        );
      }
    });
  }
}
