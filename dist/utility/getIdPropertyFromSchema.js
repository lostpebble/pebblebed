"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getIdPropertyFromSchema(schema) {
    for (const property in schema) {
        if (schema.hasOwnProperty(property)) {
            if (schema[property].role != null && schema[property].role === "id") {
                return property;
            }
        }
    }
    return null;
}
exports.default = getIdPropertyFromSchema;
//# sourceMappingURL=getIdPropertyFromSchema.js.map