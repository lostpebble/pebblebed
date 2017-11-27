import * as Joi from "joi";

export const JoiStringId: Joi.StringSchema = Joi.string().meta({
  __typeDefinition: true,
  type: "string",
  role: "id",
});

export const JoiIntegerId: Joi.NumberSchema = Joi.number().meta({
  __typeDefinition: true,
  type: "int",
  role: "id",
});

export const JoiInteger: Joi.NumberSchema = Joi.number().meta({
  __typeDefinition: true,
  type: "int",
});

export const JoiDouble: Joi.NumberSchema = Joi.number().meta({
  __typeDefinition: true,
  type: "double",
});

export const JoiGeoPoint: Joi.AnySchema = Joi.any().meta({
  __typeDefinition: true,
  type: "geoPoint",
});
