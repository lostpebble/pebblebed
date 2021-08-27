"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDatastoreDataToRegularData = void 0;
const Core_1 = require("../Core");
function convertDatastoreDataToRegularData(data, schema) {
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
        else if (schema[prop].type === "serializedJson") {
            if (schema[prop].reviver != null) {
                newData[prop] = JSON.parse(data[prop], schema[prop].reviver);
            }
            else {
                newData[prop] = JSON.parse(data[prop]);
            }
        }
        else {
            newData[prop] = data[prop];
        }
    }
    return newData;
}
exports.convertDatastoreDataToRegularData = convertDatastoreDataToRegularData;
//# sourceMappingURL=convertDatastoreDataToRegular.js.map