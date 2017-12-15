"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
function convertToType(value, type) {
    switch (type) {
        case "string": {
            return value.toString();
        }
        case "int": {
            return Core_1.default.Instance.dsModule.int(value);
        }
        case "double": {
            return Core_1.default.Instance.dsModule.double(value);
        }
        case "datetime": {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                return value;
            }
            else {
                return new Date(value);
            }
        }
        case "geoPoint": {
            if (value && value.value != null) {
                // This is the structure of the GeoPoint object
                return Core_1.default.Instance.dsModule.geoPoint(value.value);
            }
            return Core_1.default.Instance.dsModule.geoPoint(value);
        }
        case "array":
        case "boolean":
        case "object": {
            return value;
        }
        default: {
            return value;
        }
    }
}
exports.default = convertToType;
//# sourceMappingURL=convertToType.js.map