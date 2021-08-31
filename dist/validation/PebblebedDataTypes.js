"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.PebbleSerializedJson = exports.PebbleObject = exports.PebbleArray = exports.PebbleDateTime = exports.PebbleBoolean = exports.PebbleString = exports.PebbleGeoPoint = exports.PebbleDouble = exports.PebbleInteger = exports.PebbleIntegerId = exports.PebbleStringIdStrictWithFirebase = exports.PebbleStringIdStrict = exports.PebbleStringId = void 0;
const Core_1 = require("../Core");
const Joi = require("joi");
function alterSchemaForPropertyMeta(schema, meta) {
    if (meta.required) {
        return schema.required();
    }
    return schema.allow(null);
}
// console.log(Joi);
// console.log(require.resolve("joi"))
const PebbleStringId = () => Joi.string()
    .required()
    .meta({
    __typeDefinition: true,
    type: "string",
    role: "id",
});
exports.PebbleStringId = PebbleStringId;
const PebbleStringIdStrict = () => (0, exports.PebbleStringId)().regex(/^[^\/\s]+$/, "strict Datastore string id");
exports.PebbleStringIdStrict = PebbleStringIdStrict;
const PebbleStringIdStrictWithFirebase = () => (0, exports.PebbleStringId)().regex(/^[^\/\s\[\].$#]+$/, "strict Firebase-compliant string id");
exports.PebbleStringIdStrictWithFirebase = PebbleStringIdStrictWithFirebase;
const PebbleIntegerId = () => Core_1.default.Joi.number()
    .integer()
    .meta({
    __typeDefinition: true,
    type: "int",
    role: "id",
});
exports.PebbleIntegerId = PebbleIntegerId;
const PebbleInteger = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.number()
    .integer()
    .meta({
    __typeDefinition: true,
    type: "int",
    propertyMeta: meta,
}), meta);
exports.PebbleInteger = PebbleInteger;
const PebbleDouble = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.number().meta({
    __typeDefinition: true,
    type: "double",
    propertyMeta: meta,
}), meta);
exports.PebbleDouble = PebbleDouble;
const PebbleGeoPoint = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.any().meta({
    __typeDefinition: true,
    type: "geoPoint",
    propertyMeta: meta,
}), meta);
exports.PebbleGeoPoint = PebbleGeoPoint;
const PebbleString = (meta = {}, { allowEmpty = true } = {}) => alterSchemaForPropertyMeta(allowEmpty
    ? Core_1.default.Joi.string()
        .allow("")
        .meta({
        __typeDefinition: true,
        type: "string",
        propertyMeta: meta,
    })
    : Core_1.default.Joi.string().min(1).meta({
        __typeDefinition: true,
        type: "string",
        propertyMeta: meta,
    }), meta);
exports.PebbleString = PebbleString;
const PebbleBoolean = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.boolean().meta({
    __typeDefinition: true,
    type: "boolean",
    propertyMeta: meta,
}), meta);
exports.PebbleBoolean = PebbleBoolean;
const PebbleDateTime = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.date().meta({
    __typeDefinition: true,
    type: "datetime",
    propertyMeta: meta,
}), meta);
exports.PebbleDateTime = PebbleDateTime;
const PebbleArray = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.array().meta({
    __typeDefinition: true,
    type: "array",
    propertyMeta: meta,
}), meta);
exports.PebbleArray = PebbleArray;
const PebbleObject = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.object().meta({
    __typeDefinition: true,
    type: "object",
    propertyMeta: meta,
}), meta);
exports.PebbleObject = PebbleObject;
const PebbleSerializedJson = (meta = {}) => meta.joiSchema != null
    ? alterSchemaForPropertyMeta(meta.joiSchema.meta({
        __typeDefinition: true,
        type: "serializedJson",
        propertyMeta: meta,
    }), meta)
    : alterSchemaForPropertyMeta(Core_1.default.Joi.any().meta({
        __typeDefinition: true,
        type: "serializedJson",
        propertyMeta: meta,
    }), meta);
exports.PebbleSerializedJson = PebbleSerializedJson;
const dateTimeUpdated = (meta) => {
    return (0, exports.PebbleDateTime)(Object.assign({ onSave: () => new Date() }, meta));
};
const dateTimeCreated = (meta) => {
    return (0, exports.PebbleDateTime)({ onSave: date => (date ? date : new Date()) });
};
exports.types = {
    integerId: exports.PebbleIntegerId,
    stringId: exports.PebbleStringId,
    stringIdStrict: exports.PebbleStringIdStrict,
    stringIdStrictFirebase: exports.PebbleStringIdStrictWithFirebase,
    integer: exports.PebbleInteger,
    string: exports.PebbleString,
    double: exports.PebbleDouble,
    geoPoint: exports.PebbleGeoPoint,
    boolean: exports.PebbleBoolean,
    dateTime: exports.PebbleDateTime,
    array: exports.PebbleArray,
    object: exports.PebbleObject,
    serializedJson: exports.PebbleSerializedJson,
    specialized: {
        dateTimeUpdated,
        dateTimeCreated,
    },
};
//# sourceMappingURL=PebblebedDataTypes.js.map