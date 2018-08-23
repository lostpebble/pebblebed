/**
 * Created by Paul on 2017-06-02.
 *
 */
import PebblebedModel from "./PebblebedModel";
export declare function throwError(msg: string): void;
export declare function errorNoThrow(msg: string): void;
export declare function warn(msg: string): void;
export declare function LOAD_QUERY_DATA_ID_TYPE_ERROR(kind: string, wrongType: string, rightType: string, idProperty: string, id: number | string): string;
declare function OPERATION_CHANGED_ANCESTORS_WARNING(model: PebblebedModel, operation: string, prevAncestors: any, nextAncestors: any): string;
declare function DATASTORE_INSTANCE_ERROR(operation: any): string;
declare function OPERATION_MISSING_ID_ERROR(model: PebblebedModel, operation: string): string;
declare function OPERATION_SCHEMA_ID_TYPE_ERROR(model: PebblebedModel, operation: string): string;
declare function OPERATION_DATA_ID_TYPE_ERROR(model: PebblebedModel, operation: string, value: any): string;
declare function INCORRECT_ANCESTOR_KIND(model: PebblebedModel): string;
declare function SCHEMA_REQUIRED_TYPE_MISSING(property: string, kind: string): string;
declare function OPERATION_STRING_ID_EMPTY(model: PebblebedModel, operation: string): string;
declare function OPERATION_KEYS_WRONG(model: PebblebedModel, operation: string): string;
export declare const CreateMessage: {
    NO_GOOGLE_CLOUD_DEPENDENCY: string;
    DELETE_NO_DATA_IDS_ERROR: string;
    ACCESS_TRANSACTION_GENERATED_IDS_ERROR: string;
    SET_NAMESPACE_INCORRECT: string;
    INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY: string;
    OPERATION_KEYS_WRONG: typeof OPERATION_KEYS_WRONG;
    OPERATION_STRING_ID_EMPTY: typeof OPERATION_STRING_ID_EMPTY;
    SCHEMA_REQUIRED_TYPE_MISSING: typeof SCHEMA_REQUIRED_TYPE_MISSING;
    INCORRECT_ANCESTOR_KIND: typeof INCORRECT_ANCESTOR_KIND;
    OPERATION_CHANGED_ANCESTORS_WARNING: typeof OPERATION_CHANGED_ANCESTORS_WARNING;
    OPERATION_MISSING_ID_ERROR: typeof OPERATION_MISSING_ID_ERROR;
    OPERATION_DATA_ID_TYPE_ERROR: typeof OPERATION_DATA_ID_TYPE_ERROR;
    OPERATION_SCHEMA_ID_TYPE_ERROR: typeof OPERATION_SCHEMA_ID_TYPE_ERROR;
    DATASTORE_INSTANCE_ERROR: typeof DATASTORE_INSTANCE_ERROR;
    LOAD_QUERY_DATA_ID_TYPE_ERROR: typeof LOAD_QUERY_DATA_ID_TYPE_ERROR;
};
export {};
