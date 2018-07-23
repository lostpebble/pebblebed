import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
export interface ICacheDefaults {
    onSave: boolean;
    onLoad: boolean;
    onQuery: boolean;
}
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
    cacheDefaults: ICacheDefaults;
    private constructor();
    static readonly Instance: Core;
    static readonly Joi: any;
    setDatastore(datastore: any): void;
    setCacheStore(cacheStore: PebblebedCacheStore): void;
    setCacheDefaults(newDefaults: Partial<ICacheDefaults>): void;
    setNamespace(namespace: string): void;
    enableValidations(on?: boolean): void;
    enableCaching(on?: boolean): void;
}
