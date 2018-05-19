import PebblebedModel from "../PebblebedModel";
import { DatastoreEntityKey, IPebblebedModelOptions, SchemaDefinition } from "../";
export declare class DatastoreBaseOperation {
    protected model: PebblebedModel;
    protected modelOptions: IPebblebedModelOptions;
    protected kind: string;
    protected schema: SchemaDefinition<any>;
    protected idProperty: string;
    protected idType: string;
    protected hasIdProperty: boolean;
    protected namespace: any;
    protected deliberateNamespace: boolean;
    protected ancestors: Array<[string, string | number]>;
    constructor(model: PebblebedModel);
    withAncestors(...args: any[]): this;
    useNamespace(namespace: string): this;
    protected augmentKey: (key: DatastoreEntityKey) => DatastoreEntityKey;
    protected createFullKey(fullPath: any, entityKey?: DatastoreEntityKey): DatastoreEntityKey;
    protected getBaseKey(): any[];
}
export default class DatastoreOperation extends DatastoreBaseOperation {
    protected transaction: any;
    protected runValidation: boolean;
    protected useCache: boolean;
    protected cachingTimeSeconds: number;
    constructor(model: PebblebedModel);
    enableValidations(on: boolean): this;
    enableCaching(on: boolean): this;
    cachingSeconds(seconds: number): this;
    useTransaction(transaction: any): this;
}
