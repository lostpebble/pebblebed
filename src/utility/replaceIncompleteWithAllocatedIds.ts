import Core from "../Core";
import { IPebblebedSaveEntity } from "..";
import { Key, Transaction, } from "@google-cloud/datastore";
import { google } from "@google-cloud/datastore/build/protos/protos";

export default async function replaceIncompleteWithAllocatedIds<T>(
  entities: IPebblebedSaveEntity<T>[],
  transaction: Transaction | null = null
): Promise<{ ids: (string | null)[]; newEntities: IPebblebedSaveEntity<T>[] }> {
  let allocateAmount = 0;
  let incompleteKey: Key | null = null;

  for (const entity of entities) {
    if (entity.generated) {
      allocateAmount += 1;

      if (incompleteKey == null) {
        incompleteKey = entity.key;
      }
    }
  }

  const allocatedKeys = transaction ? await transaction.allocateIds(incompleteKey!, allocateAmount) : await Core.Instance.dsModule.allocateIds(incompleteKey!, allocateAmount);

  let ids: (string | null)[] = [];

  for (let i = 0; i < entities.length; i += 1) {
    if (entities[i].generated) {
      entities[i].key = allocatedKeys[0].shift()!;
      ids.push(entities[i].key.id!);
    } else {
      ids.push(null);
    }
  }

  return {ids, newEntities: entities};
}
