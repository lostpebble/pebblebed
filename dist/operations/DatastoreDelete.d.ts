import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import { DatastoreEntityKey } from "../types/PebblebedTypes";
export default class DatastoreDelete<T> extends DatastoreOperation<T> {
    private dataObjects;
    private deleteIds;
    private useIds;
    private ignoreAnc;
    private usingKeys;
    constructor(model: PebblebedModel<T>, data?: T | T[]);
    idsOrKeys(idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>): this;
    ignoreDetectedAncestors(): this;
    run(): Promise<any>;
}
