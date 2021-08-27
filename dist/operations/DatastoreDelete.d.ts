import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import { Key } from "@google-cloud/datastore";
export default class DatastoreDelete<T> extends DatastoreOperation<T> {
    private dataObjects;
    private deleteIds;
    private useIds;
    private ignoreAnc;
    private usingKeys;
    constructor(model: PebblebedModel<T>, data?: T | T[]);
    idsOrKeys(idsOrKeys: string | number | Key | Array<string | number | Key>): this;
    ignoreDetectedAncestors(): this;
    run(): Promise<any>;
}
