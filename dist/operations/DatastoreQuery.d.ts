import PebblebedModel from "../PebblebedModel";
import { DatastoreQuery } from "../";
import { InternalDatastoreQuery } from "../types/PebblebedTypes";
export declare function createDatastoreQuery(model: PebblebedModel, namespace?: string): DatastoreQuery;
export declare function createHashFromQuery(query: InternalDatastoreQuery): any;
