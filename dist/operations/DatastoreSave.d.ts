import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
interface IOSaveRunResponse<T> {
    generatedIds: (string | null)[];
    savedEntities?: T[];
}
export default class DatastoreSave<T, R extends IOSaveRunResponse<T> = {
    generatedIds: (string | null)[];
}> extends DatastoreOperation<T> {
    private dataObjects;
    private ignoreAnc;
    private generate;
    private transAllocateIds;
    private returnSaved;
    constructor(model: PebblebedModel<T>, data: T | T[]);
    useTransaction(transaction: any, options?: {
        allocateIdsNow: boolean;
    }): this;
    generateUnsetIds(): this;
    ignoreDetectedAncestors(): this;
    returnSavedEntities(): DatastoreSave<T, {
        generatedIds: (string | null)[];
        savedEntities: T[];
    }>;
    run(): Promise<R>;
}
export {};
