"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugPoint = void 0;
const PebblebedGlobalConfig_1 = require("../PebblebedGlobalConfig");
const debugPoint = (id, debugMessage, debugAction = PebblebedGlobalConfig_1.EDebugActionType.CONSOLE_LOG) => {
    const { debug, debugPointIds } = PebblebedGlobalConfig_1.PebblebedGlobalConfig.getConfig();
    if (debug) {
        if (debugPointIds.length === 0 || debugPointIds.indexOf(id) !== -1) {
            if (debugAction === PebblebedGlobalConfig_1.EDebugActionType.CONSOLE_LOG) {
                console.log(`PEBBLEBED DEBUG: ${PebblebedGlobalConfig_1.EDebugPointId}`);
                console.log(debugMessage);
            }
            else if (debugAction === PebblebedGlobalConfig_1.EDebugActionType.DEBUGGER) {
                debugger;
            }
        }
    }
};
exports.debugPoint = debugPoint;
//# sourceMappingURL=DebugUtils.js.map