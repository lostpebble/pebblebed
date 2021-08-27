"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSaveEntitiesToRegular = void 0;
const Core_1 = require("../Core");
const convertDatastoreDataToRegular_1 = require("./convertDatastoreDataToRegular");
function convertSaveEntitiesToRegular(saveEntities, idProperty, idType, schema) {
    return saveEntities.map((e) => (Object.assign(Object.assign({ [Core_1.default.Instance.dsModule.KEY]: e.key }, (0, convertDatastoreDataToRegular_1.convertDatastoreDataToRegularData)(e.data, schema)), (idProperty != null && { [idProperty]: idType === "string" ? e.key.name : e.key.id }))));
}
exports.convertSaveEntitiesToRegular = convertSaveEntitiesToRegular;
//# sourceMappingURL=convertSaveEntitesToRegular.js.map