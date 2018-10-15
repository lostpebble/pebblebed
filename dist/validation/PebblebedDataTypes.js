"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
function alterSchemaForPropertyMeta(schema, meta) {
    if (meta.required) {
        return schema.required();
    }
    return schema.allow(null);
}
exports.PebbleStringId = () => Core_1.default.Joi.string()
    .required()
    .meta({
    __typeDefinition: true,
    type: "string",
    role: "id",
});
exports.PebbleStringIdStrict = () => exports.PebbleStringId().regex(/^[^\/\s]+$/, "strict Datastore string id");
exports.PebbleStringIdStrictWithFirebase = () => exports.PebbleStringId().regex(/^[^\/\s\[\].$#]+$/, "strict Firebase-compliant string id");
exports.PebbleIntegerId = () => Core_1.default.Joi.number()
    .integer()
    .meta({
    __typeDefinition: true,
    type: "int",
    role: "id",
});
exports.PebbleInteger = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.number()
    .integer()
    .meta({
    __typeDefinition: true,
    type: "int",
    propertyMeta: meta,
}), meta);
exports.PebbleDouble = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.number().meta({
    __typeDefinition: true,
    type: "double",
    propertyMeta: meta,
}), meta);
exports.PebbleGeoPoint = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.any().meta({
    __typeDefinition: true,
    type: "geoPoint",
    propertyMeta: meta,
}), meta);
exports.PebbleString = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.string().allow("").meta({
    __typeDefinition: true,
    type: "string",
    propertyMeta: meta,
}), meta);
exports.PebbleBoolean = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.boolean().meta({
    __typeDefinition: true,
    type: "boolean",
    propertyMeta: meta,
}), meta);
exports.PebbleDateTime = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.date().meta({
    __typeDefinition: true,
    type: "datetime",
    propertyMeta: meta,
}), meta);
exports.PebbleArray = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.array().meta({
    __typeDefinition: true,
    type: "array",
    propertyMeta: meta,
}), meta);
exports.PebbleObject = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.object().meta({
    __typeDefinition: true,
    type: "object",
    propertyMeta: meta,
}), meta);
exports.PebbleSerializedJson = (meta = {}) => alterSchemaForPropertyMeta(Core_1.default.Joi.any().meta({
    __typeDefinition: true,
    type: "serializedJson",
    propertyMeta: meta,
}), meta);
const dateTimeUpdated = (meta) => {
    return exports.PebbleDateTime(Object.assign({ onSave: () => new Date() }, meta));
};
const dateTimeCreated = (meta) => {
    return exports.PebbleDateTime({ onSave: (date) => date ? date : new Date() });
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