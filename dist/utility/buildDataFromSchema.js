"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToType_1 = require("./convertToType");
const Messaging_1 = require("../Messaging");
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
                const exclude = typeof schemaProp.excludeFromIndexes === "boolean" ? schemaProp.excludeFromIndexes : false;
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
                    Messaging_1.throwError(Messaging_1.CreateMessage.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGREYXRhRnJvbVNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiJEOi9EZXYvX1Byb2plY3RzL0dpdGh1Yi9wZWJibGViZWQvc3JjLyIsInNvdXJjZXMiOlsidXRpbGl0eS9idWlsZERhdGFGcm9tU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbURBQTRDO0FBQzVDLDRDQUF5RDtBQUV6RCxNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLG9CQUFvQixFQUFFLElBQUk7Q0FDM0IsQ0FBQztBQUVGLDZCQUNFLElBQVMsRUFDVCxNQUE2QixFQUM3QixVQUFtQjtJQUVuQixJQUFJLHVCQUF1QixHQUFhLEVBQUUsQ0FBQztJQUMzQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFFdEIsR0FBRyxDQUFDLENBQUMsTUFBTSxRQUFRLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sVUFBVSxHQUE2QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLE9BQU8sR0FDWCxPQUFPLFVBQVUsQ0FBQyxrQkFBa0IsS0FBSyxTQUFTLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztnQkFFN0YsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO2dCQUVELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFM0IsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBSSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDakUsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckYsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLHVCQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0QsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLHNCQUFVLENBQUMseUJBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDL0UsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3hFLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4Qyx1QkFBdUIsR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUM7SUFDeEQsQ0FBQztJQUVELE1BQU0sQ0FBQztRQUNMLGtCQUFrQixFQUFFLHVCQUF1QjtRQUMzQyxVQUFVO0tBQ1gsQ0FBQztBQUNKLENBQUM7QUE3Q0Qsc0NBNkNDIn0=