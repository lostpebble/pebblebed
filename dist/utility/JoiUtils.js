"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
function createObjectValidator(keysSchema) {
    return Joi.object().keys(keysSchema);
}
exports.createObjectValidator = createObjectValidator;
exports.JoiUtils = {
    createObjectValidator,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSm9pVXRpbHMuanMiLCJzb3VyY2VSb290IjoiRDovRGV2L19Qcm9qZWN0cy9HaXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdHkvSm9pVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBMkI7QUFJM0IsK0JBQStDLFVBQWtDO0lBQy9FLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQWlCLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRkQsc0RBRUM7QUFFWSxRQUFBLFFBQVEsR0FBRztJQUN0QixxQkFBcUI7Q0FDdEIsQ0FBQyJ9