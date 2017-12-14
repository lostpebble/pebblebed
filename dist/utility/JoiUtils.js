"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("../Core");
function createObjectValidator(keysSchema) {
    return Core_1.default.Joi.object().keys(keysSchema);
}
exports.createObjectValidator = createObjectValidator;
exports.JoiUtils = {
    createObjectValidator,
};
//# sourceMappingURL=JoiUtils.js.map