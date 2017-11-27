import { DatastoreEntityKey, DatastoreTransaction } from "./types/PebblebedTypes";
import PebblebedModel from "./PebblebedModel";
import { PebblebedJoiSchema } from "./validation/PebblebedValidation";
export declare const Pebblebed: {
    connectDatastore: (datastore: any) => void;
    transaction: () => DatastoreTransaction;
    createSchema: <T = any>() => PebblebedJoiSchema<T>;
    setDefaultNamespace: (namespace: string) => void;
    key(...args: any[]): any;
    keysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel<any> | (keyof T))[]): DatastoreEntityKey[];
    uniqueKeysFromObjectArray<T>(sourceArray: T[], ...args: (PebblebedModel<any> | (keyof T))[]): DatastoreEntityKey[];
};
