import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
export default class Core {
    private static _instance;
    private static _redisClient;
    ds: any;
    dsModule: any;
    namespace: string;
    isProductionEnv: boolean;
    defaultCachingSeconds: number;
    validations: boolean;
    caching: boolean;
    cacheStore: PebblebedCacheStore;
    cacheEnabledOnSaveDefault: boolean;
    cacheEnabledOnLoadDefault: boolean;
    cacheEnabledOnQueryDefault: boolean;
    private constructor();
    static readonly Instance: Core;
    static readonly Joi: any;
    setDatastore(datastore: any): void;
    setCacheStore(cacheStore: PebblebedCacheStore): void;
    setNamespace(namespace: string): void;
    enableValidations(on?: boolean): void;
    enableCaching(on?: boolean): void;
}
