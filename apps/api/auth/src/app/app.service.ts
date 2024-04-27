import { Injectable } from '@nestjs/common';
import {
  EXCHANGE, 
  EXCHANGE_ROUTE,
  RabbitMQService,
} from '@travel-booking-platform/nest';

@Injectable()
export class AppService {
  constructor(private rabbitMqService: RabbitMQService) {}
  getData(): { message: string } {
    this.rabbitMqService.publish(EXCHANGE.apiAuth, EXCHANGE_ROUTE.userCreated, {
      name: 'Emmanuel Berit',
    });
    return { message: 'Hello world' };
  }
}
