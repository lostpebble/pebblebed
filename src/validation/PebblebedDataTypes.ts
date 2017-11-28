import * as Joi from "joi";
import {IOJoiSchemaPropertyMetaInput} from "../";

export type TPebblebedJoiTypeFunction<T> = (meta?: IOJoiSchemaPropertyMetaInput) => T;

export const PebbleStringId: () => Joi.StringSchema = () => Joi.string().meta({
  __typeDefinition: true,
  type: "string",
  role: "id",
});

export const PebbleIntegerId: () => Joi.NumberSchema = () => Joi.number().integer().meta({
  __typeDefinition: true,
  type: "int",
  role: "id",
});

export const PebbleInteger: TPebblebedJoiTypeFunction<Joi.NumberSchema> = (meta = {}) => Joi.number().integer().meta({
  __typeDefinition: true,
  type: "int",
}).meta(meta);

export const PebbleDouble: TPebblebedJoiTypeFunction<Joi.NumberSchema> = (meta = {}) => Joi.number().meta({
  __typeDefinition: true,
  type: "double",
}).meta(meta);

export const PebbleGeoPoint: TPebblebedJoiTypeFunction<Joi.AnySchema> = (meta = {}) => Joi.any().meta({
  __typeDefinition: true,
  type: "geoPoint",
}).meta(meta);

export const PebbleString: TPebblebedJoiTypeFunction<Joi.StringSchema> = (meta = {}) => Joi.string().meta({
  __typeDefinition: true,
  type: "string",
}).meta(meta);

export const PebbleBoolean: TPebblebedJoiTypeFunction<Joi.BooleanSchema> = (meta = {}) => Joi.boolean().meta({
  __typeDefinition: true,
  type: "boolean",
}).meta(meta);

export const PebbleDateTime: TPebblebedJoiTypeFunction<Joi.DateSchema> = (meta = {}) => Joi.date().meta({
  __typeDefinition: true,
  type: "datetime",
}).meta(meta);

export const PebbleArray: TPebblebedJoiTypeFunction<Joi.ArraySchema> = (meta = {}) => Joi.array().meta({
  __typeDefinition: true,
  type: "array",
}).meta(meta);

export const PebbleObject: TPebblebedJoiTypeFunction<Joi.ObjectSchema> = (meta = {}) => Joi.object().meta({
  __typeDefinition: true,
  type: "object",
});
