import PebblebedModel from "../PebblebedModel";
import { DatastoreEntityKey, DatastoreQuery, TDatastoreQueryResponse, TReturnOnly } from "../";
import { DatastoreQueryResponse, InternalDatastoreQuery, TFilterComparator } from "../types/PebblebedTypes";
import extractAncestorPaths from "../utility/extractAncestorPaths";
import augmentEntitiesWithIdProperties from "../utility/augmentEntitiesWithIdProperties";
import convertToType from "../utility/convertToType";
import Core from "../Core";
import pickOutEntityFromResults from "../utility/pickOutEntityFromResults";
import { warn } from "../Messaging";

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

  const useCache = (model.modelOptions.neverCache || !Core.Instance.caching)
    ? false
    : Core.Instance.cacheEnabledOnQueryDefault;

  const returnOnlyEntity: TReturnOnly = null;

  const cachingTimeSeconds =
    model.modelOptions.defaultCachingSeconds != null
      ? model.modelOptions.defaultCachingSeconds
      : Core.Instance.defaultCachingSeconds;

  return Object.assign(
    dsQuery,
    {
      returnOnlyEntity,
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
      first() {
        this.returnOnlyEntity = "FIRST";
        return this;
      },
      last() {
        this.returnOnlyEntity = "LAST";
        return this;
      },
      randomOne() {
        this.returnOnlyEntity = "RANDOM";
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
      async flushQueryInCache(): Promise<any> {
        if (Core.Instance.cacheStore != null) {
          const hash = createHashFromQuery(this);
          await Core.Instance.cacheStore.flushQueryResponse(hash, this);
        } else {
          warn(`Trying to flush a query - but no Cache Store has been set on Pebblebed instance!`);
        }
      },
      async run(): Promise<TDatastoreQueryResponse> {
        let hash = null;

        if (Core.Instance.cacheStore != null && Core.Instance.cacheStore.cacheOnQuery && this.useCache) {
          hash = createHashFromQuery(this);

          const queryResponse: DatastoreQueryResponse = await Core.Instance.cacheStore.getQueryResponse(
            hash,
            this
          );

          if (queryResponse != null) {
            cachingAugmentQueryEntitiesWithRealKeys(queryResponse);

            if (this.returnOnlyEntity != null) {
              return pickOutEntityFromResults(queryResponse.entities, this.returnOnlyEntity) as object;
            }

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

        if (this.returnOnlyEntity != null) {
          return pickOutEntityFromResults(queryResponse.entities, this.returnOnlyEntity) as object;
        }

        return queryResponse;
      },
    } as Partial<DatastoreQuery>
  );
}

export function createHashFromQuery(query: InternalDatastoreQuery) {
  const dataString = `namespace:${query.namespace != null ? query.namespace : ""}
kinds:${query.kinds.join("-KIND_JOIN-")}
filters:${JSON.stringify(query.filters)}
limit:${query.limitVal}
offset:${query.offsetVal}
orders:${query.orders.join("-ORDERS_JOIN-")}
select:${query.selectVal.join("-SELECT_JOIN-")}
groupBy:${query.groupByVal.join("-GROUP_BY_JOIN-")}
start:${query.startVal}
end:${query.endVal}`;

  console.log(`Making hash from query: \n${dataString}`);

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
