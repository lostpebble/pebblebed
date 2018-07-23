import { DatastoreEntityKey } from "../types/PebblebedTypes";
import { DatastoreBaseOperation } from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
export default class DatastoreFlush<T> extends DatastoreBaseOperation<T> {
    private flushIds;
    private usingKeys;
    constructor(model: PebblebedModel<T>, idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>);
    run(): Promise<void>;
}
