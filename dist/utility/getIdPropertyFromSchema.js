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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0SWRQcm9wZXJ0eUZyb21TY2hlbWEuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvbG9zdHBlYmJsZS9EZXYvb3RoZXJfcHJvamVjdHMvZ2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJ1dGlsaXR5L2dldElkUHJvcGVydHlGcm9tU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsaUNBQWdELE1BQTZCO0lBQzNFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sUUFBUSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwRSxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2xCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVkQsMENBVUMifQ==