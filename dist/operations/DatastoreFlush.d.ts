import { DatastoreEntityKey } from "../types/PebblebedTypes";
import { DatastoreBaseOperation } from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
export default class DatastoreFlush extends DatastoreBaseOperation {
    private flushIds;
    private usingKeys;
    constructor(model: PebblebedModel, idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>);
    run(): Promise<void>;
}
