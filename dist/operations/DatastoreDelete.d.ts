import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
export default class DatastoreDelete extends DatastoreOperation {
    private dataObjects;
    private deleteIds;
    private useIds;
    private ignoreAnc;
    constructor(model: PebblebedModel, data?: object | object[]);
    id(id: string | number): this;
    ids(ids: Array<string | number>): this;
    ignoreDetectedAncestors(): this;
    run(): any;
}
