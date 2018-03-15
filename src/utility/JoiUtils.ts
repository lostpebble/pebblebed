import * as Joi from "joi";
import Core from "../Core";

export type TPebblebedJoiSchemaObject<T> = { [key in keyof T]: Joi.Schema };

export function createObjectValidator<T = any>(keysSchema: TPebblebedJoiSchemaObject<T>) {
  return Core.Joi.object().keys(keysSchema as any);
}

export const JoiUtils = {
  createObjectValidator,
};
