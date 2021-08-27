import { DatastoreBaseOperation } from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import { Key } from "@google-cloud/datastore";
export default class DatastoreFlush<T> extends DatastoreBaseOperation<T> {
    private flushIds;
    private usingKeys;
    constructor(model: PebblebedModel<T>, idsOrKeys: string | number | Key | Array<string | number | Key>);
    run(): Promise<void>;
}
