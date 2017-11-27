"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.JoiStringId = Joi.string().meta({
    __typeDefinition: true,
    type: "string",
    role: "id",
});
exports.JoiIntegerId = Joi.number().meta({
    __typeDefinition: true,
    type: "int",
    role: "id",
});
exports.JoiInteger = Joi.number().meta({
    __typeDefinition: true,
    type: "int",
});
exports.JoiDouble = Joi.number().meta({
    __typeDefinition: true,
    type: "double",
});
exports.JoiGeoPoint = Joi.any().meta({
    __typeDefinition: true,
    type: "geoPoint",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkRGF0YVR5cGVzLmpzIiwic291cmNlUm9vdCI6IkQ6L0Rldi9fUHJvamVjdHMvR2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJ2YWxpZGF0aW9uL1BlYmJsZWJlZERhdGFUeXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUEyQjtBQUVkLFFBQUEsV0FBVyxHQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQzdELGdCQUFnQixFQUFFLElBQUk7SUFDdEIsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsSUFBSTtDQUNYLENBQUMsQ0FBQztBQUVVLFFBQUEsWUFBWSxHQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQzlELGdCQUFnQixFQUFFLElBQUk7SUFDdEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsSUFBSTtDQUNYLENBQUMsQ0FBQztBQUVVLFFBQUEsVUFBVSxHQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQzVELGdCQUFnQixFQUFFLElBQUk7SUFDdEIsSUFBSSxFQUFFLEtBQUs7Q0FDWixDQUFDLENBQUM7QUFFVSxRQUFBLFNBQVMsR0FBcUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQztJQUMzRCxnQkFBZ0IsRUFBRSxJQUFJO0lBQ3RCLElBQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQyxDQUFDO0FBRVUsUUFBQSxXQUFXLEdBQWtCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDdkQsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixJQUFJLEVBQUUsVUFBVTtDQUNqQixDQUFDLENBQUMifQ==