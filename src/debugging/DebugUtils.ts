import { EDebugActionType, EDebugPointId, PebblebedGlobalConfig } from "../PebblebedGlobalConfig";

export const debugPoint = (id: EDebugPointId, debugMessage: any, debugAction: EDebugActionType = EDebugActionType.CONSOLE_LOG) => {
  const { debug, debugPointIds } = PebblebedGlobalConfig.getConfig();
  if (debug) {
    if (debugPointIds.length === 0 || debugPointIds.indexOf(id) !== -1) {
      if (debugAction === EDebugActionType.CONSOLE_LOG) {
        console.log(`PEBBLEBED DEBUG: ${EDebugPointId}`);
        console.log(debugMessage);
      } else if (debugAction === EDebugActionType.DEBUGGER) {
        debugger;
      }
    }
  }
}