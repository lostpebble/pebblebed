import Core from "../Core";

export default async function replaceIncompleteWithAllocatedIds(entities, transaction = null) {
  let allocateAmount = 0;
  let incompleteKey = null;

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
    allocatedKeys = await Core.Instance.ds.allocateIds(incompleteKey, allocateAmount);
  }

  let ids = [];

  for (let i = 0; i < entities.length; i += 1) {
    if (entities[i].generated) {
      entities[i].key = allocatedKeys[0].shift();
      ids.push(entities[i].key.id);
    } else {
      ids.push(null);
    }
  }

  return { ids, newEntities: entities };
}
