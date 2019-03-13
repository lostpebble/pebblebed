"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
const convertDatastoreDataToRegular_1 = require("./convertDatastoreDataToRegular");
function convertSaveEntitiesToRegular(saveEntities, idProperty, idType) {
    return saveEntities.map((e) => (Object.assign({ [Core_1.default.Instance.dsModule.KEY]: e.key }, convertDatastoreDataToRegular_1.convertDatastoreDataToRegularData(e.data), (idProperty != null && { [idProperty]: idType === "string" ? e.key.name : e.key.id }))));
}
exports.convertSaveEntitiesToRegular = convertSaveEntitiesToRegular;
//# sourceMappingURL=convertSaveEntitesToRegular.js.map