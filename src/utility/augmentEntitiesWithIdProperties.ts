import Core from "../Core";
import ErrorMessages from "../ErrorMessages";

export default function augmentEntitiesWithIdProperties(
  respArray: any[],
  idProperty: string,
  type: string,
  kind: string
) {
  for (const entity of respArray) {
    if (entity[Object.getOwnPropertySymbols(entity)[0]].hasOwnProperty("id")) {
      if (type === "int") {
        entity[idProperty] = entity[Core.Instance.dsModule.KEY].id;
      } else {
        console.warn(
          ErrorMessages.LOAD_QUERY_DATA_ID_TYPE_ERROR(
            kind,
            "int",
            "string",
            idProperty,
            entity[Core.Instance.dsModule.KEY].id
          )
        );
      }
    }

    if (entity[Core.Instance.dsModule.KEY].hasOwnProperty("name")) {
      if (type === "string") {
        entity[idProperty] = entity[Core.Instance.dsModule.KEY].name;
      } else {
        console.warn(
          ErrorMessages.LOAD_QUERY_DATA_ID_TYPE_ERROR(
            kind,
            "string",
            "int",
            idProperty,
            entity[Core.Instance.dsModule.KEY].name
          )
        );
      }
    }
  }
}
