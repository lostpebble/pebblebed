import { ConfigStore } from "dynamic-config-store";

export enum EDebugPointId {
  ON_SAVE_BUILT_ENTITIES = "ON_SAVE_BUILT_ENTITIES",
}

export enum EDebugActionType {
  CONSOLE_LOG = "CONSOLE_LOG",
  DEBUGGER = "DEBUGGER",
}

export interface IPebblebedGlobalConfig {
  debug: boolean;
  debugActionType: EDebugActionType;
  debugPointIds: EDebugPointId[];
}

export const PebblebedGlobalConfig = new ConfigStore<IPebblebedGlobalConfig>({
  debug: false,
  debugActionType: EDebugActionType.DEBUGGER,
  debugPointIds: [],
}, "CONFIG_OVERRIDE_PEBBLEBED_GLOBAL_", "Pebblebed Global Config");
