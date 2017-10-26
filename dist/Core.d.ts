export default class Core {
    private static _instance;
    ds: any;
    dsModule: any;
    namespace: string;
    private constructor();
    static readonly Instance: Core;
    setDatastore(datastore: any): void;
    setNamespace(namespace: string): void;
}
