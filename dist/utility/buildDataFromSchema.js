"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToType_1 = require("./convertToType");
const Messaging_1 = require("../Messaging");
const schemaOptionProps = {
    __excludeFromIndexes: true,
};
function buildDataFromSchema(data, schema, entityKind) {
    let excludeFromIndexesArray = [];
    const dataObject = {};
    for (const property in schema) {
        if (schema.hasOwnProperty(property) && !schemaOptionProps[property]) {
            const schemaProp = schema[property];
            if (schemaProp.role !== "id") {
                const exclude = typeof schemaProp.excludeFromIndexes === "boolean" ? schemaProp.excludeFromIndexes : false;
                if (exclude && schemaProp.type !== "array") {
                    excludeFromIndexesArray.push(property);
                }
                let value = data[property];
                if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
                    value = schemaProp.onSave(value);
                }
                if (!(value === null || value === undefined)) {
                    dataObject[property] = convertToType_1.default(value, schemaProp.type);
                }
                else if (schemaProp.required) {
                    Messaging_1.throwError(Messaging_1.CreateMessage.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind));
                }
                else if (!(value === undefined)) {
                    dataObject[property] = value;
                }
                else if (!schemaProp.optional || schemaProp.hasOwnProperty("default")) {
                    dataObject[property] = schemaProp.default != null ? schemaProp.default : null;
                }
            }
        }
    }
    if (schema.__excludeFromIndexes != null) {
        excludeFromIndexesArray = schema.__excludeFromIndexes;
    }
    return {
        excludeFromIndexes: excludeFromIndexesArray,
        dataObject,
    };
}
exports.default = buildDataFromSchema;
//# sourceMappingURL=buildDataFromSchema.js.map