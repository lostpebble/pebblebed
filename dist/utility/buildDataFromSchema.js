"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preBuildDataFromSchema = void 0;
const convertToType_1 = require("./convertToType");
const Messaging_1 = require("../Messaging");
const schemaOptionProps = {
    __excludeFromIndexes: true,
};
function preBuildDataFromSchema(data, schema) {
    const dataObject = {};
    for (const property of Object.keys(schema)) {
        if (!schemaOptionProps[property]) {
            const schemaProp = schema[property];
            if (schemaProp.role !== "id") {
                let value = data[property];
                if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
                    value = schemaProp.onSave(value);
                }
                if (value === undefined && (!schemaProp.optional || schemaProp.hasOwnProperty("default"))) {
                    dataObject[property] = schemaProp.default != null ? schemaProp.default : null;
                }
                dataObject[property] = value;
            }
            else {
                dataObject[property] = data[property];
            }
        }
    }
    return dataObject;
}
exports.preBuildDataFromSchema = preBuildDataFromSchema;
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
                    dataObject[property] = (0, convertToType_1.default)(value, schemaProp.type);
                }
                else if (schemaProp.required) {
                    (0, Messaging_1.throwError)(Messaging_1.CreateMessage.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind));
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