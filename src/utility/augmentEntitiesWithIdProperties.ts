import Core from "../Core";
import { CreateMessage, throwError, warn } from "../Messaging";
import { Key } from "@google-cloud/datastore";

export default function augmentEntitiesWithIdProperties(
  respArray: any[],
  idProperty: string,
  type: string,
  kind: string
) {
  for (const entity of respArray) {
    const key: Key = entity[Core.Instance.dsModule.KEY];

    if (!key) {
      console.error(entity);
      throwError(`Something went wrong trying to augment an entity with its ID property from the Datastore key - please make sure you are not running two libraries of @google-cloud/datastore somehow`);
    }

    if (key.hasOwnProperty("id")) {
      if (type === "int") {
        entity[idProperty] = key.id;
      } else {
        warn(
          CreateMessage.LOAD_QUERY_DATA_ID_TYPE_ERROR(
            kind,
            "int",
            "string",
            idProperty,
            entity[Core.Instance.dsModule.KEY].id
          )
        );
      }
    }

    if (key.hasOwnProperty("name")) {
      if (type === "string") {
        entity[idProperty] = key.name;
      } else {
        warn(
          CreateMessage.LOAD_QUERY_DATA_ID_TYPE_ERROR(
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
