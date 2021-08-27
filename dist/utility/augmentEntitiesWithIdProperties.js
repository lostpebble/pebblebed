"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
const Messaging_1 = require("../Messaging");
function augmentEntitiesWithIdProperties(respArray, idProperty, type, kind) {
    for (const entity of respArray) {
        const key = entity[Core_1.default.Instance.dsModule.KEY];
        if (!key) {
            console.error(entity);
            (0, Messaging_1.throwError)(`Something went wrong trying to augment an entity with its ID property from the Datastore key - please make sure you are not running two libraries of @google-cloud/datastore somehow`);
        }
        if (key.hasOwnProperty("id")) {
            if (type === "int") {
                entity[idProperty] = key.id;
            }
            else {
                (0, Messaging_1.warn)(Messaging_1.CreateMessage.LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, "int", "string", idProperty, entity[Core_1.default.Instance.dsModule.KEY].id));
            }
        }
        if (key.hasOwnProperty("name")) {
            if (type === "string") {
                entity[idProperty] = key.name;
            }
            else {
                (0, Messaging_1.warn)(Messaging_1.CreateMessage.LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, "string", "int", idProperty, entity[Core_1.default.Instance.dsModule.KEY].name));
            }
        }
    }
}
exports.default = augmentEntitiesWithIdProperties;
//# sourceMappingURL=augmentEntitiesWithIdProperties.js.map