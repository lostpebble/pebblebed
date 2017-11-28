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
    constructor(model: PebblebedModel);
    withAncestors(...args: any[]): this;
    setValidations(on: boolean): void;
    useTransaction(transaction: any): this;
    useNamespace(namespace: string): this;
    protected createFullKey(fullPath: any): any;
    protected getBaseKey(): any[];
}
