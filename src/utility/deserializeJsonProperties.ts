import { SchemaDefinition } from "..";

export default function deserializeJsonProperties(
  respArray: any[],
  schema: SchemaDefinition,
) {
  const reviveProperties: string[] = [];

  for (const property in schema) {
    if (schema.hasOwnProperty(property)) {
      if (schema[property].type === "serializedJson") {
        reviveProperties.push(property);
      }
    }
  }

  if (reviveProperties.length > 0) {
    for (const entity of respArray) {
      for (const property of reviveProperties) {
        if (entity[property] != null) {
          if (schema[property].reviver != null) {
            entity[property] = JSON.parse(entity[property], schema[property].reviver);
          } else {
            entity[property] = JSON.parse(entity[property]);
          }
        }
      }
    }
  }
}
