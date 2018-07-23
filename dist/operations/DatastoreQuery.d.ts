import PebblebedModel from "../PebblebedModel";
import { DatastoreQueryRegular } from "../";
import { InternalDatastoreQuery } from "../types/PebblebedTypes";
export declare function createDatastoreQuery<T>(model: PebblebedModel, namespace?: string): DatastoreQueryRegular<T>;
export declare function createDataStringFromQuery(query: InternalDatastoreQuery): string;
export declare function createHashFromQuery(query: InternalDatastoreQuery): any;
