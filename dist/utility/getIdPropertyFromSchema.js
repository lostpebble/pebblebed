"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getIdPropertyFromSchema(schema) {
    for (const property in schema) {
        if (schema.hasOwnProperty(property)) {
            if (schema[property].role != null && schema[property].role === "id") {
                return property;
            }
        }
    }
    return null;
}
exports.default = getIdPropertyFromSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0SWRQcm9wZXJ0eUZyb21TY2hlbWEuanMiLCJzb3VyY2VSb290IjoiRDovRGV2L19Qcm9qZWN0cy9HaXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdHkvZ2V0SWRQcm9wZXJ0eUZyb21TY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBZ0QsTUFBNkI7SUFDM0UsR0FBRyxDQUFDLENBQUMsTUFBTSxRQUFRLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BFLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDbEIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFWRCwwQ0FVQyJ9