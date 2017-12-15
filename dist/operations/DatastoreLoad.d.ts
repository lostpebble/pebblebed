import { DatastoreEntityKey } from "../types/PebblebedTypes";
import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
export default class DatastoreLoad extends DatastoreOperation {
    private loadIds;
    private usingKeys;
    constructor(model: PebblebedModel, idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>);
    run(): Promise<any>;
}
