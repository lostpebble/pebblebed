import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
export default class DatastoreSave<T> extends DatastoreOperation<T> {
    private dataObjects;
    private ignoreAnc;
    private generate;
    private transAllocateIds;
    constructor(model: PebblebedModel<T>, data: T | T[]);
    useTransaction(transaction: any, options?: {
        allocateIdsNow: boolean;
    }): this;
    generateUnsetIds(): this;
    ignoreDetectedAncestors(): this;
    run(): Promise<{
        generatedIds: (string | null)[];
    }>;
}
