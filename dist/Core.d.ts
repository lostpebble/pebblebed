import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
export default class Core {
    private static _instance;
    private static _redisClient;
    ds: any;
    dsModule: any;
    namespace: string;
    isProductionEnv: boolean;
    validations: boolean;
    cacheStore: PebblebedCacheStore;
    private constructor();
    static readonly Instance: Core;
    static readonly Joi: any;
    setDatastore(datastore: any): void;
    setCacheStore(cacheStore: PebblebedCacheStore): void;
    setNamespace(namespace: string): void;
    setValidations(on: boolean): void;
}
