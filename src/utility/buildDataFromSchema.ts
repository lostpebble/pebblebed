import { SchemaDefinition, SchemaPropertyDefinition } from "../types/PebblebedTypes";
import convertToType from "./convertToType";
import { CreateMessage, throwError } from "../Messaging";

const schemaOptionProps = {
  __excludeFromIndexes: true,
};

export default function buildDataFromSchema(
  data: any,
  schema: SchemaDefinition<any>,
  entityKind?: string
): { excludeFromIndexes: string[]; dataObject: object } {
  let excludeFromIndexesArray: string[] = [];
  const dataObject = {};

  for (const property in schema) {
    if (schema.hasOwnProperty(property) && !schemaOptionProps[property]) {
      const schemaProp: SchemaPropertyDefinition = schema[property];

      if (schemaProp.role !== "id") {
        const exclude =
          typeof schemaProp.excludeFromIndexes === "boolean" ? schemaProp.excludeFromIndexes : false;

        if (exclude && schemaProp.type !== "array") {
          excludeFromIndexesArray.push(property);
        }

        let value = data[property];

        if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
          value = schemaProp.onSave(value);
        }

        if (!(value == null) || (data.hasOwnProperty(property) && !(data[property] == null))) {
          dataObject[property] = convertToType(value, schemaProp.type);
        } else if (schemaProp.required) {
          throwError(CreateMessage.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind));
        } else if (!schemaProp.optional) {
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
