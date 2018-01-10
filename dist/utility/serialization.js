"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reviveDateObjects(key, value) {
    if (isSerializedDate(value)) {
        return new Date(value);
    }
    return value;
}
exports.reviveDateObjects = reviveDateObjects;
const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
function isSerializedDate(value) {
    return isString(value) && value.length > 15 && value.length < 30 && datePattern.test(value);
}
function isString(value) {
    return {}.toString.call(value) === "[object String]";
}
//# sourceMappingURL=serialization.js.map