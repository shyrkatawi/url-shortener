import { registerDecorator } from "class-validator";
import type { ValidationArguments, ValidationOptions } from "class-validator";

const isoUtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isFutureDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!isoUtcRegex.test(value)) {
            return false;
          }
          return new Date(value) > new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ISO 8601 UTC date string ending with 'Z' and must be in the future`;
        },
      },
    });
  };
}
