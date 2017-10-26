import Core from "../Core";

export default function convertToType(value: any, type: string) {
  switch (type) {
    case "string": {
      return value.toString();
    }
    case "int": {
      return Core.Instance.dsModule.int(value);
    }
    case "double": {
      return Core.Instance.dsModule.double(value);
    }
    case "datetime": {
      if (Object.prototype.toString.call(value) === "[object Date]") {
        return value;
      } else {
        return new Date(value);
      }
    }
    case "geoPoint": {
      if (value && value.value != null) {
        // This is the structure of the GeoPoint object
        return Core.Instance.dsModule.geoPoint(value.value);
      }

      return Core.Instance.dsModule.geoPoint(value);
    }
    case "array":
    case "boolean":
    case "object": {
      return value;
    }
    default: {
      return value;
    }
  }
}
