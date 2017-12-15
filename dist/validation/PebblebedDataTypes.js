"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
exports.PebbleStringId = () => Core_1.default.Joi.string().required().meta({
    __typeDefinition: true,
    type: "string",
    role: "id",
});
exports.PebbleIntegerId = () => Core_1.default.Joi.number().integer().meta({
    __typeDefinition: true,
    type: "int",
    role: "id",
});
exports.PebbleInteger = (meta = {}) => Core_1.default.Joi.number().integer().meta({
    __typeDefinition: true,
    type: "int",
    propertyMeta: meta,
});
exports.PebbleDouble = (meta = {}) => Core_1.default.Joi.number().meta({
    __typeDefinition: true,
    type: "double",
    propertyMeta: meta,
});
exports.PebbleGeoPoint = (meta = {}) => Core_1.default.Joi.any().meta({
    __typeDefinition: true,
    type: "geoPoint",
    propertyMeta: meta,
});
exports.PebbleString = (meta = {}) => Core_1.default.Joi.string().meta({
    __typeDefinition: true,
    type: "string",
    propertyMeta: meta,
});
exports.PebbleBoolean = (meta = {}) => Core_1.default.Joi.boolean().meta({
    __typeDefinition: true,
    type: "boolean",
    propertyMeta: meta,
});
exports.PebbleDateTime = (meta = {}) => Core_1.default.Joi.date().meta({
    __typeDefinition: true,
    type: "datetime",
    propertyMeta: meta,
});
exports.PebbleArray = (meta = {}) => Core_1.default.Joi.array().meta({
    __typeDefinition: true,
    type: "array",
    propertyMeta: meta,
});
exports.PebbleObject = (meta = {}) => Core_1.default.Joi.object().meta({
    __typeDefinition: true,
    type: "object",
    propertyMeta: meta,
});
//# sourceMappingURL=PebblebedDataTypes.js.map