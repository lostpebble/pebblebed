import { SchemaDefinition } from "..";

export default function serializeJsonProperties(
  entities: any[],
  schema: SchemaDefinition,
) {
  const serializeProperties: string[] = [];

  for (const property in schema) {
    if (schema.hasOwnProperty(property)) {
      if (schema[property].type === "serializedJson") {
        serializeProperties.push(property);
      }
    }
  }

  if (serializeProperties.length > 0) {
    for (const entity of entities) {
      for (const property of serializeProperties) {
        entity[property] = JSON.stringify(entity[property]);
      }
    }
  }
}
