/**
 * Created by Paul on 2017-06-02.
 *
 */
import PebblebedModel from "./PebblebedModel";
export declare function LOAD_QUERY_DATA_ID_TYPE_ERROR(kind: string, wrongType: string, rightType: string, idProperty: string, id: number | string): string;
declare const _default: {
    NO_GOOGLE_CLOUD_DEPENDENCY: string;
    DELETE_NO_DATA_IDS_ERROR: string;
    ACCESS_TRANSACTION_GENERATED_IDS_ERROR: string;
    SET_NAMESPACE_INCORRECT: string;
    INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY: string;
    OPERATION_KEYS_WRONG: (model: PebblebedModel, operation: string) => string;
    OPERATION_STRING_ID_EMPTY: (model: PebblebedModel, operation: string) => string;
    SCHEMA_REQUIRED_TYPE_MISSING: (property: string, kind: string) => string;
    INCORRECT_ANCESTOR_KIND: (model: PebblebedModel) => string;
    OPERATION_CHANGED_ANCESTORS_WARNING: (model: PebblebedModel, operation: string, prevAncestors: any, nextAncestors: any) => string;
    OPERATION_MISSING_ID_ERROR: (model: PebblebedModel, operation: string) => string;
    OPERATION_DATA_ID_TYPE_ERROR: (model: PebblebedModel, operation: string, value: any) => string;
    OPERATION_SCHEMA_ID_TYPE_ERROR: (model: PebblebedModel, operation: string) => string;
    DATASTORE_INSTANCE_ERROR: (operation: any) => string;
    LOAD_QUERY_DATA_ID_TYPE_ERROR: (kind: string, wrongType: string, rightType: string, idProperty: string, id: string | number) => string;
};
export default _default;
