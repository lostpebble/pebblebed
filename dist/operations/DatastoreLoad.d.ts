import DatastoreOperation from "./DatastoreOperation";
import PebblebedModel from "../PebblebedModel";
import { DatastoreEntityKey } from "../";
export interface IDatastoreLoadSingleReturn<T> extends DatastoreOperation<T> {
    run(): Promise<T | null>;
    run(throwIfNotFound: true): Promise<T>;
}
export interface IDatastoreLoadRegular<T> extends DatastoreOperation<T> {
    first(): IDatastoreLoadSingleReturn<T>;
    last(): IDatastoreLoadSingleReturn<T>;
    randomOne(): IDatastoreLoadSingleReturn<T>;
    run(): Promise<Array<T>>;
    run(throwIfNotFound: true): Promise<Array<T>>;
}
export default class DatastoreLoad<T> extends DatastoreOperation<T> implements IDatastoreLoadRegular<T> {
    private loadIds;
    private usingKeys;
    private returnOnlyEntity;
    constructor(model: PebblebedModel<T>, idsOrKeys: string | number | DatastoreEntityKey | Array<string | number | DatastoreEntityKey>);
    first(): this;
    last(): this;
    randomOne(): this;
    run(throwIfNotFound?: boolean): Promise<any>;
}
