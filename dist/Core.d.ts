import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
import * as datastore from "@google-cloud/datastore";
import { Datastore } from "@google-cloud/datastore";
export interface ICacheDefaults {
    onSave: boolean;
    onLoad: boolean;
    onQuery: boolean;
}
export declare const UNSET_NAMESPACE = "__PEBBLEBED_DELIBERATE_UNSET_NAMESPACE__";
export default class Core {
    private static _instance;
    private static _redisClient;
    ds: typeof datastore;
    dsModule: Datastore;
    namespace: string | null;
    isProductionEnv: boolean;
    defaultCachingSeconds: number;
    validations: boolean;
    caching: boolean;
    cacheStore: PebblebedCacheStore | null;
    cacheDefaults: ICacheDefaults;
    private constructor();
    static get Instance(): Core;
    static get Joi(): typeof import("joi");
    setDatastore(datastore: Datastore): void;
    setCacheStore(cacheStore: PebblebedCacheStore): void;
    setCacheDefaults(newDefaults: Partial<ICacheDefaults>): void;
    setNamespace(namespace: string | null): void;
    enableValidations(on?: boolean): void;
    enableCaching(on?: boolean): void;
}
