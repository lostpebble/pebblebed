import { DatastoreEntityKey, DatastoreTransaction, IPebblebedModelOptions } from "./types/PebblebedTypes";
import PebblebedModel from "./PebblebedModel";
import { ICacheDefaults } from "./Core";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
import { PebblebedCacheStore } from "./caching/PebblebedCacheStore";
import { TPebblebedJoiSchemaObject } from "./utility/JoiUtils";
export declare const Pebblebed: {
    connectDatastore: (datastore: any) => void;
    readonly ds: any;
    flushCacheKeys(keys: DatastoreEntityKey[]): Promise<void>;
    transaction: () => DatastoreTransaction;
    combineSchemas: <T = any>(...schemas: PebblebedJoiSchema<Partial<T>>[]) => PebblebedJoiSchema<T>;
    createSchema: <T = any>(schema: TPebblebedJoiSchemaObject<T>) => PebblebedJoiSchema<T>;
    createModel: <T = any>(entityKind: string, entitySchema: PebblebedJoiSchema<T>, options?: IPebblebedModelOptions) => PebblebedModel<T>;
    setCacheStore: (cacheStore: PebblebedCacheStore) => void;
    clearDefaultNamespace: () => void;
    setDefaultNamespace: (namespace: string | null) => void;
    enableValidations(on?: boolean): void;
    enableCaching(on?: boolean): void;
    setDefaultCachingSeconds: (seconds: number) => void;
    setCacheEnabledOnSaveDefault(on: boolean): void;
    setCacheEnabledOnLoadDefault(on: boolean): void;
    setCacheEnabledOnQueryDefault(on: boolean): void;
    setCacheEnabledDefaults(newDefaults: Partial<ICacheDefaults>): void;
    key(...args: any[]): any;
    keysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel<any> | keyof T)[]): DatastoreEntityKey[];
    uniqueKeysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel<any> | keyof T)[]): DatastoreEntityKey[];
};
