import { SchemaDefinition } from "../types/PebblebedTypes";
import PebblebedModel from "../PebblebedModel";
export default class DatastoreOperation {
    protected model: PebblebedModel;
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
    enableValidations(on: boolean): void;
    enableCaching(on: boolean): void;
    cachingSeconds(seconds: number): void;
    useTransaction(transaction: any): this;
    useNamespace(namespace: string): this;
    protected createFullKey(fullPath: any): any;
    protected getBaseKey(): any[];
}
