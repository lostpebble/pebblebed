import PebblebedModel from "../PebblebedModel";
import { DatastoreEntityKey, DatastoreQuery } from "../";
import { DatastoreQueryResponse, InternalDatastoreQuery, TFilterComparator } from "../types/PebblebedTypes";
import extractAncestorPaths from "../utility/extractAncestorPaths";
import augmentEntitiesWithIdProperties from "../utility/augmentEntitiesWithIdProperties";
import convertToType from "../utility/convertToType";
import Core from "../Core";

const crypto = require("crypto");

export function createDatastoreQuery(model: PebblebedModel, namespace: string = null): DatastoreQuery {
  const idProp = model.entityIdProperty;
  const kind = model.entityKind;
  const hasIdProp = model.entityHasIdProperty;
  const type = hasIdProp ? model.entitySchema[model.entityIdProperty].type : null;
  const schema = model.entitySchema;

  const ns = namespace != null ? namespace : Core.Instance.namespace;

  const dsQuery =
    ns != null
      ? Core.Instance.ds.createQuery(ns, model.entityKind)
      : Core.Instance.ds.createQuery(model.entityKind);

  const runQuery = dsQuery.run.bind(dsQuery);
  const filterQuery = dsQuery.filter.bind(dsQuery);

  const useCache = model.modelOptions.neverCache ? false : Core.Instance.caching;
  const cachingTimeSeconds =
    model.modelOptions.defaultCachingSeconds != null
      ? model.modelOptions.defaultCachingSeconds
      : Core.Instance.defaultCachingSeconds;

  return Object.assign(
    dsQuery,
    {
      useCache,
      cachingTimeSeconds,
      enableCache(on: boolean) {
        this.useCache = on;
        return this;
      },
      cachingSeconds(seconds: number) {
        this.cachingTimeSeconds = seconds;
        return this;
      },
      filter(
        property: string,
        comparator: TFilterComparator,
        value: string | number | boolean | Date
      ): DatastoreQuery {
        return filterQuery(property, comparator, convertToType(value, schema[property].type));
      },
      withAncestors(...args: any[]): DatastoreQuery {
        const ancestors = extractAncestorPaths(model, ...args);

        if (ns != null) {
          this.hasAncestor(
            Core.Instance.ds.key({
              namespace: ns,
              path: [].concat.apply([], ancestors),
            })
          );
        } else {
          this.hasAncestor(Core.Instance.ds.key([].concat.apply([], ancestors)));
        }

        return this;
      },
      async run(): Promise<DatastoreQueryResponse> {
        let hash = null;

        if (Core.Instance.cacheStore != null && Core.Instance.cacheStore.cacheOnQuery && this.useCache) {
          hash = createHashFromQuery(this);

          const queryResponse: DatastoreQueryResponse = await Core.Instance.cacheStore.getQueryResponse(
            hash,
            this
          );

          if (queryResponse != null) {
            cachingAugmentQueryEntitiesWithRealKeys(queryResponse);
            return queryResponse;
          }
        }

        const data = await runQuery();

        if (hasIdProp && data[0].length > 0) {
          augmentEntitiesWithIdProperties(data[0], idProp, type, kind);
        }

        const queryResponse = {
          entities: data[0],
          info: data[1],
        };

        if (
          Core.Instance.cacheStore != null &&
          Core.Instance.cacheStore.cacheOnQuery &&
          this.useCache &&
          queryResponse.entities.length > 0
        ) {
          if (hash == null) {
            hash = createHashFromQuery(this);
          }

          cachingAugmentQueryEntitiesWithSerializableKeys(queryResponse);
          await Core.Instance.cacheStore.setQueryResponse(queryResponse, hash, this.cachingTimeSeconds, this);
          removeSerializableKeysFromEntities(queryResponse);
        }

        return queryResponse;
      },
    } as Partial<DatastoreQuery>
  );
}

export function createHashFromQuery(query: InternalDatastoreQuery) {
  const dataString = `kinds:${query.kinds.join("-KIND_JOIN-")}
filters:${JSON.stringify(query.filters)}
limit:${query.limitVal}
offset:${query.offsetVal}
orders:${query.orders.join("-ORDERS_JOIN-")}
select:${query.selectVal.join("-SELECT_JOIN-")}
groupBy:${query.groupByVal.join("-GROUP_BY_JOIN-")}
start:${query.startVal}
end:${query.endVal}`;

  return crypto.createHash("sha1").update(dataString).digest("base64");
}

const serializableKeyName = "__pebblebed_serializable_key__";

function cachingAugmentQueryEntitiesWithSerializableKeys(queryResponse: DatastoreQueryResponse) {
  for (const entity of queryResponse.entities) {
    entity[serializableKeyName] = entity[Core.Instance.dsModule.KEY];
  }
}

function removeSerializableKeysFromEntities(queryResponse: DatastoreQueryResponse) {
  for (const entity of queryResponse.entities) {
    delete entity[serializableKeyName];
  }
}

function cachingAugmentQueryEntitiesWithRealKeys(queryResponse: DatastoreQueryResponse) {
  for (const entity of queryResponse.entities) {
    entity[Core.Instance.dsModule.KEY] = entity[serializableKeyName];
    delete entity[serializableKeyName];
  }
}
