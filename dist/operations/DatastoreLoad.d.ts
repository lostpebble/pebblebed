import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import { DatastoreEntityKey } from "../";
export default class DatastoreLoad extends DatastoreOperation {
    private loadIds;
    private usingKeys;
    private returnOnlyEntity;
    constructor(model: PebblebedModel, idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>);
    first(): this;
    last(): this;
    randomOne(): this;
    run(): Promise<any>;
}
