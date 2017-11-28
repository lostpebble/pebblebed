export default class Core {
    private static _instance;
    ds: any;
    dsModule: any;
    namespace: string;
    isProductionEnv: boolean;
    validations: boolean;
    private constructor();
    static readonly Instance: Core;
    static readonly Joi: any;
    setDatastore(datastore: any): void;
    setNamespace(namespace: string): void;
    setValidations(on: boolean): void;
}
