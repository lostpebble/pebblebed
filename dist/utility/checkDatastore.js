"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
const Messaging_1 = require("../Messaging");
function checkDatastore(operation) {
    if (Core_1.default.Instance.ds == null) {
        (0, Messaging_1.throwError)("Datastore has not been connected to Pebblebed");
    }
}
exports.default = checkDatastore;
//# sourceMappingURL=checkDatastore.js.map