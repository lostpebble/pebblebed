"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
function convertDatastoreDataToRegularData(data) {
    const newData = {};
    for (const prop of Object.keys(data)) {
        if (Core_1.default.Instance.dsModule.isInt(data[prop])) {
            newData[prop] = Number(data[prop].value);
        }
        else if (Core_1.default.Instance.dsModule.isDouble(data[prop])) {
            newData[prop] = Number(data[prop].value);
        }
        else if (Core_1.default.Instance.dsModule.isGeoPoint(data[prop])) {
            newData[prop] = data[prop].value;
        }
        else {
            newData[prop] = data[prop];
        }
    }
    return newData;
}
exports.convertDatastoreDataToRegularData = convertDatastoreDataToRegularData;
//# sourceMappingURL=convertDatastoreDataToRegular.js.map