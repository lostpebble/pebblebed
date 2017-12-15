import { DatastoreEntityKey, DatastoreTransaction, IPebblebedModelOptions } from "./types/PebblebedTypes";
import PebblebedModel from "./PebblebedModel";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
import { TJoiValidObjectKeys } from "./utility/JoiUtils";
export declare const Pebblebed: {
    connectDatastore: (datastore: any) => void;
    transaction: () => DatastoreTransaction;
    createSchema: <T = any>(schema: TJoiValidObjectKeys<T>) => PebblebedJoiSchema<T>;
    createModel: <T = any>(entityKind: string, entitySchema: PebblebedJoiSchema<T>, options?: IPebblebedModelOptions) => PebblebedModel<T>;
    setCacheStore: (cacheStore: PebblebedCacheStore) => void;
    setDefaultNamespace: (namespace: string) => void;
    setDefaultCachingSeconds: (seconds: number) => void;
    enableValidations(on?: boolean): void;
    enableCaching(on?: boolean): void;
    key(...args: any[]): any;
    keysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel<any> | (keyof T))[]): DatastoreEntityKey[];
    uniqueKeysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel<any> | (keyof T))[]): DatastoreEntityKey[];
};
