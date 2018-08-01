"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function serializeJsonProperties(entities, schema) {
    const serializeProperties = [];
    for (const property in schema) {
        if (schema.hasOwnProperty(property)) {
            if (schema[property].type === "serializedJson") {
                serializeProperties.push(property);
            }
        }
    }
    if (serializeProperties.length > 0) {
        for (const entity of entities) {
            for (const property of serializeProperties) {
                entity[property] = JSON.stringify(entity[property]);
            }
        }
    }
}
exports.default = serializeJsonProperties;
//# sourceMappingURL=serializeJsonProperties.js.map