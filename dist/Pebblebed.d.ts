import { DatastoreEntityKey, DatastoreTransaction } from "./types/PebblebedTypes";
import PebblebedModel from "./PebblebedModel";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
export declare const Pebblebed: {
    connectDatastore: (datastore: any) => void;
    transaction: () => DatastoreTransaction;
    createSchema: <T = any>() => PebblebedJoiSchema<T>;
    setCacheStore: (cacheStore: PebblebedCacheStore) => void;
    setDefaultNamespace: (namespace: string) => void;
    key(...args: any[]): any;
    keysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel<any> | (keyof T))[]): DatastoreEntityKey[];
    uniqueKeysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel<any> | (keyof T))[]): DatastoreEntityKey[];
};
