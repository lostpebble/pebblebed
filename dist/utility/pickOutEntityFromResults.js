"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(resultArray, pickType) {
    if (resultArray.length > 0) {
        if (pickType === "FIRST") {
            return resultArray[0];
        }
        else if (pickType === "LAST") {
            return resultArray[resultArray.length - 1];
        }
        else {
            const randomIndex = Math.floor(Math.random() * resultArray.length);
            return resultArray[randomIndex];
        }
    }
    else {
        return null;
    }
}
exports.default = default_1;
//# sourceMappingURL=pickOutEntityFromResults.js.map