import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MQ_QUEUE, RabbitMQService } from '@travel-booking-platform/nest';
import { Channel } from 'amqplib';
import { HotelRoomService } from '../services/hotel-room.service';
import { HotelRoomReservation } from '@travel-booking-platform/types';

@Injectable()
export class RoomReservationJob implements OnModuleInit {
  private readonly logger: Logger;
  private interval: NodeJS.Timeout;
  private channel: Channel;
  constructor(
    private mqService: RabbitMQService,
    private roomService: HotelRoomService
  ) {
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
      this.processRoomReservationCreated();
    }
  }

  private processRoomReservationCreated(): void {
    this.channel.consume(MQ_QUEUE.hotelRoomReservationCreated, async (msg) => {
      if (msg && msg.content) {
        console.log(
          'This is the message from the room reservation job',
          JSON.parse(msg.content.toString())
        );
        const {
          hotelRoomReservation: { room },
        } = JSON.parse(msg.content.toString()) as {
          hotelRoomReservation: HotelRoomReservation;
        };
        this.roomService.update({ _id: room }, { is_available: false });
        this.channel.ack(msg);
      }
    });
  }
}
