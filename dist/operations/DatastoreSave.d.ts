import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
export default class DatastoreSave extends DatastoreOperation {
    private dataObjects;
    private ignoreAnc;
    private generate;
    private transAllocateIds;
    constructor(model: PebblebedModel, data: object | object[]);
    useTransaction(transaction: any, options?: {
        allocateIdsNow: boolean;
    }): this;
    generateUnsetIds(): this;
    ignoreDetectedAncestors(): this;
    run(): Promise<any>;
}
