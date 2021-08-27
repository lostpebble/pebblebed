import PebblebedModel from "../PebblebedModel";
import { IPebblebedModelOptions, SchemaDefinition } from "../";
import { Key } from "@google-cloud/datastore";
export declare class DatastoreBaseOperation<T> {
    protected model: PebblebedModel;
    protected modelOptions: IPebblebedModelOptions;
    protected kind: string;
    protected schema: SchemaDefinition<any>;
    protected idProperty: string | null;
    protected idType: "string" | "int";
    protected hasIdProperty: boolean;
    protected defaultNamespace: string | null;
    protected deliberateNamespace: string | null;
    protected ancestors: Array<[string, string | number]>;
    constructor(model: PebblebedModel<T>);
    withAncestors(...args: any[]): this;
    useNamespace(namespace: string | null): this;
    protected getFinalNamespace(keyOriginalNamespace?: string | undefined): string | undefined;
    protected augmentKey: (key: Key) => Key;
    protected createFullKey(fullPath: any[], entityKey?: Key): Key;
    protected getBaseKey(): any[];
}
export default class DatastoreOperation<T> extends DatastoreBaseOperation<T> {
    protected transaction: any;
    protected runValidation: boolean;
    protected useCache: boolean;
    protected cachingTimeSeconds: number;
    constructor(model: PebblebedModel<T>);
    enableValidations(on: boolean): this;
    enableCaching(on: boolean): this;
    cachingSeconds(seconds: number): this;
    useTransaction(transaction: any): this;
}
