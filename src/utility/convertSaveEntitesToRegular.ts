import { IPebblebedSaveEntity } from "..";
import Core from "../Core";
import { convertDatastoreDataToRegularData } from "./convertDatastoreDataToRegular";

export function convertSaveEntitiesToRegular<T>(
  saveEntities: IPebblebedSaveEntity<T>[],
  idProperty: string | null,
  idType: "string" | "int"
): T[] {
  return saveEntities.map(
    (e): T =>
      ({
        [Core.Instance.dsModule.KEY]: e.key,
        ...convertDatastoreDataToRegularData(e.data),
        ...(idProperty != null && { [idProperty]: idType === "string" ? e.key.name : e.key.id }),
      } as any)
  );
}
