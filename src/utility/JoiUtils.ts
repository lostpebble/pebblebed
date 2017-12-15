import * as Joi from "joi";
import Core from "../Core";

export type TJoiValidObjectKeys<T> = { [key in keyof T]: Joi.Schema };

export function createObjectValidator<T = any>(keysSchema: TJoiValidObjectKeys<T>) {
  return Core.Joi.object().keys(keysSchema as any);
}

export const JoiUtils = {
  createObjectValidator,
};
