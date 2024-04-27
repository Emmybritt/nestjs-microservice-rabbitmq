import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import { Connection } from 'mongoose';

@Injectable()
@ValidatorConstraint({ async: true })
export class ExistsValidator {
  private readonly logger = new Logger(ExistsInCollection.name);

  constructor(@InjectConnection() private connection: Connection) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    if (!value) return false;
    this.logger.debug({ value, args });
    try {
      const exist = await this.connection
        .model(args.constraints[0])
        .exists({ _id: value });
      this.logger.debug({ exist });
      return !!exist;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} doesn't exist`;
  }
}

export function ExistsInCollection(
  modelName: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'existsInCollection',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [modelName],
      // async: true,
      validator: ExistsValidator,
      // validator: {
      //   async validate(value: any, args): Promise<boolean> {
      //     const model = getModelToken(modelName) as unknown as Model<any>;
      //     console.log({ model });
      //     if (!model) {
      //       return false;
      //     }

      //     const existsValidator = new ExistsValidator();
      //     return existsValidator.validate(value, model);
      //   },
      // },
    });
  };
}
