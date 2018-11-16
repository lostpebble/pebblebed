import { ConfigStore } from "dynamic-config-store";
export declare enum EDebugPointId {
    ON_SAVE_BUILT_ENTITIES = "ON_SAVE_BUILT_ENTITIES"
}
export declare enum EDebugActionType {
    CONSOLE_LOG = "CONSOLE_LOG",
    DEBUGGER = "DEBUGGER"
}
export interface IPebblebedGlobalConfig {
    debug: boolean;
    debugActionType: EDebugActionType;
    debugPointIds: EDebugPointId[];
}
export declare const PebblebedGlobalConfig: ConfigStore<IPebblebedGlobalConfig>;
