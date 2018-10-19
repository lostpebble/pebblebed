import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
export interface ICacheDefaults {
    onSave: boolean;
    onLoad: boolean;
    onQuery: boolean;
}
export declare const UNSET_NAMESPACE = "__PEBBLEBED_DELIBERATE_UNSET_NAMESPACE__";
export default class Core {
    private static _instance;
    private static _redisClient;
    ds: any;
    dsModule: any;
    namespace: string | null;
    isProductionEnv: boolean;
    defaultCachingSeconds: number;
    validations: boolean;
    caching: boolean;
    cacheStore: PebblebedCacheStore | null;
    cacheDefaults: ICacheDefaults;
    private constructor();
    static readonly Instance: Core;
    static readonly Joi: any;
    setDatastore(datastore: any): void;
    setCacheStore(cacheStore: PebblebedCacheStore): void;
    setCacheDefaults(newDefaults: Partial<ICacheDefaults>): void;
    setNamespace(namespace: string | null): void;
    enableValidations(on?: boolean): void;
    enableCaching(on?: boolean): void;
}
