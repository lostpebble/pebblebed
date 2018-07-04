import {
  IOJoiSchemaObjectPropertyMetaInput,
  IOJoiSchemaPropertyMetaInput,
  IOJoiSchemaSerializedJsonPropertyMetaInput,
} from "../";
import Core from "../Core";
import * as Joi from "joi";

export type TPebblebedJoiTypeFunction<T, K, I = IOJoiSchemaPropertyMetaInput<K>> = (meta?: I) => T;

function alterSchemaForPropertyMeta<T extends Joi.AnySchema, K>(
  schema: T,
  meta: IOJoiSchemaPropertyMetaInput<K>
): T {
  if (meta.required) {
    return schema.required();
  }

  return schema.allow(null);
}

export const PebbleStringId: () => Joi.StringSchema = () =>
  Core.Joi.string()
    .required()
    .meta({
      __typeDefinition: true,
      type: "string",
      role: "id",
    });

export const PebbleIntegerId: () => Joi.NumberSchema = () =>
  Core.Joi.number()
    .integer()
    .meta({
      __typeDefinition: true,
      type: "int",
      role: "id",
    });

export const PebbleInteger: TPebblebedJoiTypeFunction<Joi.NumberSchema, number> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.NumberSchema, number>(
    Core.Joi.number()
      .integer()
      .meta({
        __typeDefinition: true,
        type: "int",
        propertyMeta: meta,
      }),
    meta
  );

export const PebbleDouble: TPebblebedJoiTypeFunction<Joi.NumberSchema, number> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.NumberSchema, number>(
    Core.Joi.number().meta({
      __typeDefinition: true,
      type: "double",
      propertyMeta: meta,
    }),
    meta
  );

export const PebbleGeoPoint: TPebblebedJoiTypeFunction<Joi.AnySchema, any> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.AnySchema, any>(
    Core.Joi.any().meta({
      __typeDefinition: true,
      type: "geoPoint",
      propertyMeta: meta,
    }),
    meta
  );

export const PebbleString: TPebblebedJoiTypeFunction<Joi.StringSchema, string> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.StringSchema, string>(
    Core.Joi.string().meta({
      __typeDefinition: true,
      type: "string",
      propertyMeta: meta,
    }),
    meta
  );

export const PebbleBoolean: TPebblebedJoiTypeFunction<Joi.BooleanSchema, boolean> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.BooleanSchema, boolean>(
    Core.Joi.boolean().meta({
      __typeDefinition: true,
      type: "boolean",
      propertyMeta: meta,
    }),
    meta
  );

export const PebbleDateTime: TPebblebedJoiTypeFunction<Joi.DateSchema, Date> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.DateSchema, Date>(
    Core.Joi.date().meta({
      __typeDefinition: true,
      type: "datetime",
      propertyMeta: meta,
    }),
    meta
  );

export const PebbleArray: TPebblebedJoiTypeFunction<Joi.ArraySchema, any[]> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.ArraySchema, any[]>(
    Core.Joi.array().meta({
      __typeDefinition: true,
      type: "array",
      propertyMeta: meta,
    }),
    meta
  );

export const PebbleObject: TPebblebedJoiTypeFunction<
  Joi.ObjectSchema,
  object,
  IOJoiSchemaPropertyMetaInput<object> & IOJoiSchemaObjectPropertyMetaInput
> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.ObjectSchema, object>(
    Core.Joi.object().meta({
      __typeDefinition: true,
      type: "object",
      propertyMeta: meta,
    }),
    meta
  );

export const PebbleSerializedJson: TPebblebedJoiTypeFunction<
  Joi.AnySchema,
  any,
  IOJoiSchemaPropertyMetaInput<any> & IOJoiSchemaSerializedJsonPropertyMetaInput
> = (meta = {}) =>
  alterSchemaForPropertyMeta<Joi.AnySchema, any>(
    Core.Joi.any().meta({
      __typeDefinition: true,
      type: "serializedJson",
      propertyMeta: meta,
    }),
    meta
  );

export const types = {
  integerId: PebbleIntegerId,
  stringId: PebbleStringId,
  integer: PebbleInteger,
  string: PebbleString,
  double: PebbleDouble,
  geoPoint: PebbleGeoPoint,
  boolean: PebbleBoolean,
  dateTime: PebbleDateTime,
  array: PebbleArray,
  object: PebbleObject,
  serializedJson: PebbleSerializedJson,
};
