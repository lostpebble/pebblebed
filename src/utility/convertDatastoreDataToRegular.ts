import Core from "../Core";

export function convertDatastoreDataToRegularData(data: any): any {
  const newData: any = {};

  for (const prop of Object.keys(data)) {
    if (Core.Instance.dsModule.isInt(data[prop])) {
      newData[prop] = Number(data[prop].value);
    } else if (Core.Instance.dsModule.isDouble(data[prop])) {
      newData[prop] = Number(data[prop].value);
    } else if (Core.Instance.dsModule.isGeoPoint(data[prop])) {
      newData[prop] = data[prop].value;
    } else {
      newData[prop] = data[prop];
    }
  }

  return newData;
}