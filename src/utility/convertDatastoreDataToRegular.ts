import Core from "../Core";
import { SchemaDefinition } from "..";

export function convertDatastoreDataToRegularData(data: any, schema: SchemaDefinition<any>): any {
  const newData: any = {};

  for (const prop of Object.keys(data)) {
    if (Core.Instance.dsModule.isInt(data[prop])) {
      newData[prop] = Number(data[prop].value);
    } else if (Core.Instance.dsModule.isDouble(data[prop])) {
      newData[prop] = Number(data[prop].value);
    } else if (Core.Instance.dsModule.isGeoPoint(data[prop])) {
      newData[prop] = data[prop].value;
    } else if(schema[prop].type === "serializedJson") {
      if (schema[prop].reviver != null) {
        newData[prop] = JSON.parse(data[prop], schema[prop].reviver);
      } else {
        newData[prop] = JSON.parse(data[prop]);
      }
    } else {
      newData[prop] = data[prop];
    }
  }

  return newData;
}