"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToType_1 = require("./convertToType");
const ErrorMessages_1 = require("../ErrorMessages");
const schemaOptionProps = {
    __excludeFromIndexes: true,
};
function buildDataFromSchema(data, schema, entityKind) {
    let excludeFromIndexesArray = [];
    const dataObject = {};
    for (const property in schema) {
        if (schema.hasOwnProperty(property) && !schemaOptionProps[property]) {
            const schemaProp = schema[property];
            if (schemaProp.role !== "id") {
                const exclude = typeof schemaProp.excludeFromIndexes === "boolean"
                    ? schemaProp.excludeFromIndexes
                    : false;
                if (exclude && schemaProp.type !== "array") {
                    excludeFromIndexesArray.push(property);
                }
                let value = data[property];
                if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
                    value = schemaProp.onSave(value);
                }
                if (!(value == null) || (data.hasOwnProperty(property) && !(data[property] == null))) {
                    dataObject[property] = convertToType_1.default(value, schemaProp.type);
                }
                else if (schemaProp.required) {
                    throw new Error(ErrorMessages_1.default.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind));
                }
                else if (!schemaProp.optional) {
                    dataObject[property] = schemaProp.default ? schemaProp.default : null;
                }
            }
        }
    }
    if (schema.__excludeFromIndexes != null) {
        excludeFromIndexesArray = schema.__excludeFromIndexes;
    }
    return {
        excludeFromIndexes: excludeFromIndexesArray,
        dataObject,
    };
}
exports.default = buildDataFromSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGREYXRhRnJvbVNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9sb3N0cGViYmxlL0Rldi9vdGhlcl9wcm9qZWN0cy9naXRodWIvcGViYmxlYmVkL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdHkvYnVpbGREYXRhRnJvbVNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1EQUE0QztBQUM1QyxvREFBNkM7QUFFN0MsTUFBTSxpQkFBaUIsR0FBRztJQUN4QixvQkFBb0IsRUFBRSxJQUFJO0NBQzNCLENBQUM7QUFFRiw2QkFDRSxJQUFTLEVBQ1QsTUFBNkIsRUFDN0IsVUFBbUI7SUFFbkIsSUFBSSx1QkFBdUIsR0FBYSxFQUFFLENBQUM7SUFDM0MsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBRXRCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sUUFBUSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxNQUFNLFVBQVUsR0FBNkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTlELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxPQUFPLEdBQ1gsT0FBTyxVQUFVLENBQUMsa0JBQWtCLEtBQUssU0FBUztzQkFDOUMsVUFBVSxDQUFDLGtCQUFrQjtzQkFDN0IsS0FBSyxDQUFDO2dCQUVaLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzNDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekMsQ0FBQztnQkFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRTNCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ2pFLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JGLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyx1QkFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9ELENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUFhLENBQUMsNEJBQTRCLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BGLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUN4RSxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEMsdUJBQXVCLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDO0lBQ3hELENBQUM7SUFFRCxNQUFNLENBQUM7UUFDTCxrQkFBa0IsRUFBRSx1QkFBdUI7UUFDM0MsVUFBVTtLQUNYLENBQUM7QUFDSixDQUFDO0FBL0NELHNDQStDQyJ9