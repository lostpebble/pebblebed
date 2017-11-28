import { IOJoiSchemaObjectPropertyMetaInput, IOJoiSchemaPropertyMetaInput } from "../";
import Core from "../Core";
import * as Joi from "joi";

export type TPebblebedJoiTypeFunction<T, I = IOJoiSchemaPropertyMetaInput> = (meta?: I) => T;

export const PebbleStringId: () => Joi.StringSchema = () => Core.Joi.string().meta({
  __typeDefinition: true,
  type: "string",
  role: "id",
});

export const PebbleIntegerId: () => Joi.NumberSchema = () => Core.Joi.number().integer().meta({
  __typeDefinition: true,
  type: "int",
  role: "id",
});

export const PebbleInteger: TPebblebedJoiTypeFunction<Joi.NumberSchema> = (meta = {}) => Core.Joi.number().integer().meta({
  __typeDefinition: true,
  type: "int",
}).meta(meta);

export const PebbleDouble: TPebblebedJoiTypeFunction<Joi.NumberSchema> = (meta = {}) => Core.Joi.number().meta({
  __typeDefinition: true,
  type: "double",
}).meta(meta);

export const PebbleGeoPoint: TPebblebedJoiTypeFunction<Joi.AnySchema> = (meta = {}) => Core.Joi.any().meta({
  __typeDefinition: true,
  type: "geoPoint",
}).meta(meta);

export const PebbleString: TPebblebedJoiTypeFunction<Joi.StringSchema> = (meta = {}) => Core.Joi.string().meta({
  __typeDefinition: true,
  type: "string",
}).meta(meta);

export const PebbleBoolean: TPebblebedJoiTypeFunction<Joi.BooleanSchema> = (meta = {}) => Core.Joi.boolean().meta({
  __typeDefinition: true,
  type: "boolean",
}).meta(meta);

export const PebbleDateTime: TPebblebedJoiTypeFunction<Joi.DateSchema> = (meta = {}) => Core.Joi.date().meta({
  __typeDefinition: true,
  type: "datetime",
}).meta(meta);

export const PebbleArray: TPebblebedJoiTypeFunction<Joi.ArraySchema> = (meta = {}) => Core.Joi.array().meta({
  __typeDefinition: true,
  type: "array",
}).meta(meta);

export const PebbleObject: TPebblebedJoiTypeFunction<Joi.ObjectSchema, IOJoiSchemaPropertyMetaInput & IOJoiSchemaObjectPropertyMetaInput> = (meta = {}) => Core.Joi.object().meta({
  __typeDefinition: true,
  type: "object",
}).meta(meta);
