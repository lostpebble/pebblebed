import { warn } from "../Messaging";
import { DatastoreEntityKey } from "../";

export class PebblebedCacheStore {
  cacheOnSave = true;
  cacheOnLoad = true;

  async getEntitiesByKeys(keys: DatastoreEntityKey[]): Promise<null | any[]> {
    warn(`Pebblebed: Caching: Trying to get cached entities before a load, but getEntitiesByKeys() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async setEntitiesAfterLoadOrSave(entities: any[], secondsToCache: number) {
    warn(`Pebblebed: Caching: Trying to cache entities after a load or save, but setEntitiesAfterLoadOrSave() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async setEntitiesByQuery(query: any) {
    warn(`Pebblebed: Caching: Trying to cache entities after a query, but setEntitiesByQuery() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async getEntitiesByQuery(query: any) {
    warn(`Pebblebed: Caching: Trying to get a query result from the cache, but getEntitiesByQuery() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async flushEntitiesByKeys(keys: DatastoreEntityKey[]) {
    warn(`Pebblebed: Caching: Trying to flush entities by keys, but flushEntitiesByKeys() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async flushEntities() {
    warn(`Pebblebed: Caching: Trying to flush entities, but flushEntities() hasn't been implemented in your cache store yet.`);
    return null;
  }

  async flushQueries() {
    warn(`Pebblebed: Caching: Trying to flush queries, but flushQueries() hasn't been implemented in your cache store yet.`);
    return null;
  }
}
