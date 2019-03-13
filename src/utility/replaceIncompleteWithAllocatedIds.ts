import Core from "../Core";
import { DatastoreEntityKey, IPebblebedSaveEntity } from "..";

export default async function replaceIncompleteWithAllocatedIds<T>(
  entities: IPebblebedSaveEntity<T>[],
  transaction: any | null = null
): Promise<{ ids: (string | null)[]; newEntities: IPebblebedSaveEntity<T>[] }> {
  let allocateAmount = 0;
  let incompleteKey: DatastoreEntityKey | null = null;

  for (const entity of entities) {
    if (entity.generated) {
      allocateAmount += 1;

      if (incompleteKey == null) {
        incompleteKey = entity.key;
      }
    }
  }

  let allocatedKeys;

  if (transaction) {
    allocatedKeys = await transaction.allocateIds(incompleteKey, allocateAmount);
  } else {
    allocatedKeys = await Core.Instance.dsModule.allocateIds(incompleteKey, allocateAmount);
  }

  let ids: (string | null)[] = [];

  for (let i = 0; i < entities.length; i += 1) {
    if (entities[i].generated) {
      entities[i].key = allocatedKeys[0].shift();
      ids.push(entities[i].key.id!);
    } else {
      ids.push(null);
    }
  }

  return { ids, newEntities: entities };
}
