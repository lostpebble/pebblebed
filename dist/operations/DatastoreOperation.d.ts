import { SchemaDefinition } from "../types/PebblebedTypes";
import PebblebedModel from "../PebblebedModel";
import { IPebblebedModelOptions } from "../";
export default class DatastoreOperation {
    protected model: PebblebedModel;
    protected modelOptions: IPebblebedModelOptions;
    protected kind: string;
    protected schema: SchemaDefinition<any>;
    protected idProperty: string;
    protected idType: string;
    protected hasIdProperty: boolean;
    protected namespace: any;
    protected ancestors: Array<[string, string | number]>;
    protected transaction: any;
    protected runValidation: boolean;
    protected useCache: boolean;
    protected cachingTimeSeconds: number;
    constructor(model: PebblebedModel);
    withAncestors(...args: any[]): this;
    enableValidations(on: boolean): this;
    enableCaching(on: boolean): this;
    cachingSeconds(seconds: number): this;
    useTransaction(transaction: any): this;
    useNamespace(namespace: string): this;
    protected createFullKey(fullPath: any): any;
    protected getBaseKey(): any[];
}
