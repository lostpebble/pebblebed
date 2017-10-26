import { DatastoreEntityKey, DatastoreTransaction } from "./types/PebblebedTypes";
import PebblebedModel from "./PebblebedModel";
export declare const Pebblebed: {
    connectDatastore: (datastore: any) => void;
    transaction: () => DatastoreTransaction;
    setDefaultNamespace: (namespace: string) => void;
    key(...args: any[]): any;
    keysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel | (keyof T))[]): DatastoreEntityKey[];
    uniqueKeysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel | (keyof T))[]): DatastoreEntityKey[];
};
