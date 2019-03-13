import PebblebedModel from "../PebblebedModel";
import { DatastoreEntityKey, DatastoreQuery, DatastoreQueryRegular, TReturnOnly } from "../";
import { DatastoreQueryResponse, InternalDatastoreQuery, TFilterComparator } from "../types/PebblebedTypes";
import extractAncestorPaths from "../utility/extractAncestorPaths";
import augmentEntitiesWithIdProperties from "../utility/augmentEntitiesWithIdProperties";
import convertToType from "../utility/convertToType";
import Core, { UNSET_NAMESPACE } from "../Core";
import pickOutEntityFromResults from "../utility/pickOutEntityFromResults";
import { throwError, warn } from "../Messaging";
import deserializeJsonProperties from "../utility/deserializeJsonProperties";

const crypto = require("crypto");

export function createDatastoreQuery<T>(model: PebblebedModel, namespace: string|null): DatastoreQueryRegular<T> {
  const idProp = model.entityIdProperty;
  const kind = model.entityKind;
  const hasIdProp = model.entityHasIdProperty;
  const type = hasIdProp ? model.entitySchema[model.entityIdProperty!].type : null;
  const schema = model.entitySchema;

  const ns: string|null = namespace !== UNSET_NAMESPACE ? namespace : (Core.Instance.namespace !== UNSET_NAMESPACE ? Core.Instance.namespace : null);

  const dsQuery =
    (ns != null && ns !== UNSET_NAMESPACE)
      ? Core.Instance.dsModule.createQuery(ns, model.entityKind)
      : Core.Instance.dsModule.createQuery(model.entityKind);

  const runQuery = dsQuery.run.bind(dsQuery);
  const filterQuery = dsQuery.filter.bind(dsQuery);

  const useCache = (model.modelOptions.neverCache || !Core.Instance.caching)
    ? false
    : Core.Instance.cacheDefaults.onQuery;

  const returnOnlyEntity: TReturnOnly|null = null;

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
      ) {
        if (!schema[property]) {
          throwError(`Property "${property}" doesn't exist on entity schema for [ ${kind} ]`);
        }

        return filterQuery(property, comparator, convertToType(value, schema[property].type));
      },
      withAncestors(...args: any[]) {
        const ancestors = extractAncestorPaths(model, ...args);

        if (ns != null) {
          this.hasAncestor(
            Core.Instance.dsModule.key({
              namespace: ns,
              path: [].concat.apply([], ancestors),
            })
          );
        } else {
          this.hasAncestor(Core.Instance.dsModule.key([].concat.apply([], ancestors)));
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
      async run(throwIfNotFound: boolean = false) {
        let hash: string|null = null;

        if (Core.Instance.cacheStore != null && Core.Instance.cacheStore.cacheOnQuery && this.useCache) {
          hash = createHashFromQuery(this);

          const queryResponse: DatastoreQueryResponse<T> = await Core.Instance.cacheStore.getQueryResponse(
            hash!,
            this
          );

          if (queryResponse != null) {
            cachingAugmentQueryEntitiesWithRealKeys(queryResponse);

            deserializeJsonProperties(queryResponse.entities, schema);

            if (this.returnOnlyEntity != null) {
              return pickOutEntityFromResults(queryResponse.entities, this.returnOnlyEntity) as T;
            }

            return queryResponse;
          }
        }

        const data = await runQuery();

        if (hasIdProp && data[0].length > 0) {
          augmentEntitiesWithIdProperties(data[0], idProp!, type!, kind);
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
          await Core.Instance.cacheStore.setQueryResponse(queryResponse, hash!, this.cachingTimeSeconds, this);
          removeSerializableKeysFromEntities(queryResponse);
        }

        deserializeJsonProperties(queryResponse.entities, schema);

        if (queryResponse.entities.length === 0 && throwIfNotFound) {
          console.error(`Couldn't find any ${this.model.entityKind} entity(s) with specified query:\n\n${createDataStringFromQuery(this)}`);
          throwError(`Couldn't find any ${this.model.entityKind} entity(s) with specified query, see server log for more detail`);
        }

        if (this.returnOnlyEntity != null) {
          return pickOutEntityFromResults<T>(queryResponse.entities, this.returnOnlyEntity);
        }

        return queryResponse;
      },
    } as Partial<DatastoreQueryRegular<T>>
  ) as DatastoreQueryRegular<T>;
}

export function createDataStringFromQuery(query: InternalDatastoreQuery): string {
  return `namespace:${query.namespace != null ? query.namespace : ""}
kinds:${query.kinds.join("-KIND_JOIN-")}
filters:${JSON.stringify(query.filters)}
limit:${query.limitVal}
offset:${query.offsetVal}
orders:${query.orders.join("-ORDERS_JOIN-")}
select:${query.selectVal.join("-SELECT_JOIN-")}
groupBy:${query.groupByVal.join("-GROUP_BY_JOIN-")}
start:${query.startVal}
end:${query.endVal}`;
}

export function createHashFromQuery(query: InternalDatastoreQuery) {
  /*const dataString = `namespace:${query.namespace != null ? query.namespace : ""}
kinds:${query.kinds.join("-KIND_JOIN-")}
filters:${JSON.stringify(query.filters)}
limit:${query.limitVal}
offset:${query.offsetVal}
orders:${query.orders.join("-ORDERS_JOIN-")}
select:${query.selectVal.join("-SELECT_JOIN-")}
groupBy:${query.groupByVal.join("-GROUP_BY_JOIN-")}
start:${query.startVal}
end:${query.endVal}`;*/

  return crypto.createHash("sha1").update(createDataStringFromQuery(query)).digest("base64");
}

const serializableKeyName = "__pebblebed_serializable_key__";

function cachingAugmentQueryEntitiesWithSerializableKeys(queryResponse: DatastoreQueryResponse<any>) {
  for (const entity of queryResponse.entities) {
    entity[serializableKeyName] = entity[Core.Instance.dsModule.KEY];
  }
}

function removeSerializableKeysFromEntities(queryResponse: DatastoreQueryResponse<any>) {
  for (const entity of queryResponse.entities) {
    delete entity[serializableKeyName];
  }
}

function cachingAugmentQueryEntitiesWithRealKeys(queryResponse: DatastoreQueryResponse<any>) {
  for (const entity of queryResponse.entities) {
    entity[Core.Instance.dsModule.KEY] = entity[serializableKeyName];
    delete entity[serializableKeyName];
  }
}
