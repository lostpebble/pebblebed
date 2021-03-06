import { SchemaDefinition, SchemaPropertyDefinition } from "../types/PebblebedTypes";
import convertToType from "./convertToType";
import { CreateMessage, throwError } from "../Messaging";

const schemaOptionProps = {
  __excludeFromIndexes: true,
};

export function preBuildDataFromSchema<T>(
  data: any,
  schema: SchemaDefinition<any>,
): T {
  const dataObject: T = {} as T;

  for (const property of Object.keys(schema)) {
    if (!schemaOptionProps[property]) {
      const schemaProp: SchemaPropertyDefinition = schema[property];

      if (schemaProp.role !== "id") {
        let value: any = data[property];

        if (schemaProp.onSave && typeof schemaProp.onSave === "function") {
          value = schemaProp.onSave(value);
        }

        if (value === undefined && (!schemaProp.optional || schemaProp.hasOwnProperty("default"))) {
          dataObject[property] = schemaProp.default != null ? schemaProp.default : null;
        }

        dataObject[property] = value;
      } else {
        dataObject[property] = data[property];
      }
    }
  }

  return dataObject;
}

export default function buildDataFromSchema<T>(
  data: any,
  schema: SchemaDefinition<any>,
  entityKind?: string
): { excludeFromIndexes: string[]; dataObject: T } {
  let excludeFromIndexesArray: string[] = [];
  const dataObject: T = {} as T;

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

        if (!(value === null || value === undefined)) {
          dataObject[property] = convertToType(value, schemaProp.type);
        } else if (schemaProp.required) {
          throwError(CreateMessage.SCHEMA_REQUIRED_TYPE_MISSING(property, entityKind!));
        } else if (!(value === undefined)) {
          dataObject[property] = value;
        } else if (!schemaProp.optional || schemaProp.hasOwnProperty("default")) {
          dataObject[property] = schemaProp.default != null ? schemaProp.default : null;
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
