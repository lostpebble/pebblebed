"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
const Messaging_1 = require("../Messaging");
function augmentEntitiesWithIdProperties(respArray, idProperty, type, kind) {
    for (const entity of respArray) {
        if (entity[Object.getOwnPropertySymbols(entity)[0]].hasOwnProperty("id")) {
            if (type === "int") {
                entity[idProperty] = entity[Core_1.default.Instance.dsModule.KEY].id;
            }
            else {
                Messaging_1.warn(Messaging_1.CreateMessage.LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, "int", "string", idProperty, entity[Core_1.default.Instance.dsModule.KEY].id));
            }
        }
        if (entity[Core_1.default.Instance.dsModule.KEY].hasOwnProperty("name")) {
            if (type === "string") {
                entity[idProperty] = entity[Core_1.default.Instance.dsModule.KEY].name;
            }
            else {
                Messaging_1.warn(Messaging_1.CreateMessage.LOAD_QUERY_DATA_ID_TYPE_ERROR(kind, "string", "int", idProperty, entity[Core_1.default.Instance.dsModule.KEY].name));
            }
        }
    }
}
exports.default = augmentEntitiesWithIdProperties;
//# sourceMappingURL=augmentEntitiesWithIdProperties.js.map