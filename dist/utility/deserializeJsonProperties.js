"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Messaging_1 = require("../Messaging");
function deserializeJsonProperties(respArray, schema) {
    const reviveProperties = [];
    for (const property in schema) {
        if (schema.hasOwnProperty(property)) {
            if (schema[property].type === "serializedJson") {
                reviveProperties.push(property);
            }
        }
    }
    if (reviveProperties.length > 0) {
        for (const entity of respArray) {
            for (const property of reviveProperties) {
                if (entity[property] != null) {
                    try {
                        if (schema[property].reviver != null) {
                            entity[property] = JSON.parse(entity[property], schema[property].reviver);
                        }
                        else {
                            entity[property] = JSON.parse(entity[property]);
                        }
                    }
                    catch (e) {
                        if (typeof entity[property] === "string") {
                            (0, Messaging_1.errorNoThrow)(`Trying to deserialize entity property [${property}] with a JSON string type has failed. The string could me malformed JSON and cannot convert.\n${e.message}`);
                            console.error(e);
                        }
                        else {
                            (0, Messaging_1.errorNoThrow)(`Trying to deserialize entity property [${property}] with a JSON string type has failed. It appears to not be a string at all: typeof = ${typeof entity[property]}`);
                            console.error(e);
                        }
                    }
                }
            }
        }
    }
}
exports.default = deserializeJsonProperties;
//# sourceMappingURL=deserializeJsonProperties.js.map