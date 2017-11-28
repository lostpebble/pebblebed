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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSm9pVXRpbHMuanMiLCJzb3VyY2VSb290IjoiRDovRGV2L19Qcm9qZWN0cy9HaXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdHkvSm9pVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrQ0FBMkI7QUFJM0IsK0JBQStDLFVBQWtDO0lBQy9FLE1BQU0sQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFpQixDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUZELHNEQUVDO0FBRVksUUFBQSxRQUFRLEdBQUc7SUFDdEIscUJBQXFCO0NBQ3RCLENBQUMifQ==