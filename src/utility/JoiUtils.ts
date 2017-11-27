import * as Joi from "joi";

export type TJoiValidObjectKeys<T> = { [key in keyof T]: Joi.Schema };

export function createObjectValidator<T = any>(keysSchema: TJoiValidObjectKeys<T>) {
  return Joi.object().keys(keysSchema as any);
}

export const JoiUtils = {
  createObjectValidator,
};
