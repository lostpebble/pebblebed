import { SchemaDefinition } from "../types/PebblebedTypes";

export default function getIdPropertyFromSchema(schema: SchemaDefinition<any>) {
  for (const property in schema) {
    if (schema.hasOwnProperty(property)) {
      if (schema[property].role != null && schema[property].role === "id") {
        return property;
      }
    }
  }

  return null;
}
