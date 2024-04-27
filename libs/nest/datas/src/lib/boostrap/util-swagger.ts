import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerBuilderOption {
  basePath: string;
  title: string;
  description?: string;
  version: string;
  endpoint: string;
  bearerAuth?: boolean;
}

export const bootstrapSwagger = (
  app: INestApplication,
  option: SwaggerBuilderOption
) => {
  const options = new DocumentBuilder()
    .setTitle(option.title)
    .setDescription(option.description as string)
    .setVersion(option.version)
    .addServer(option.basePath)
    .setExternalDoc(
      'API Documentation',
      'https://api.travel-booking-platform.com/doc'
    )
    .setTermsOfService('https://api.travel-booking-platform.com/doc/terms')
    .setContact(
      'Travel Booking Platform',
      'https://api.travel-booking-platform.com/doc',
      'beritogwu@gmail.com'
    );
  if (option.bearerAuth) {
    options.addBearerAuth();
  }
  const document = SwaggerModule.createDocument(app, options.build(), {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup(option.endpoint, app, document);
};
