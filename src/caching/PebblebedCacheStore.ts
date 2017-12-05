import { warn } from "../Messaging";
import { DatastoreEntityKey } from "../";

export class PebblebedCacheStore {
  async getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<null | any[]> {
    warn(`Pebblebed: Caching: Trying to get cached entities before a load, but getEntitiesByKeys() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async setEntitiesAfterLoadOrSave(entities: any[], secondsToCache: number) {
    warn(`Pebblebed: Caching: Trying to cache entities after a load or save, but setEntitiesAfterLoadOrSave() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async getEntitiesByQuery(query: any) {
    warn(`Pebblebed: Caching: Trying to cache a query, but onQuery() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async onFlushEntitiesByKeys(keys: DatastoreEntityKey[]) {
    warn(`Pebblebed: Caching: Trying to flush / rehydrate entities by keys, but onFlushEntitiesByKeys() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async onFlushEntities() {
    warn(`Pebblebed: Caching: Trying to flush / rehydrate entities, but onFlushEntities() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async onFlushQueries() {
    warn(`Pebblebed: Caching: Trying to flush / rehydrate queries, but onFlushQueries() hasn't been implemented in your cache store yet.`);
    return null;
  }
}
