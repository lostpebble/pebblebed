"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PebblebedGlobalConfig = exports.EDebugActionType = exports.EDebugPointId = void 0;
const dynamic_config_store_1 = require("dynamic-config-store");
var EDebugPointId;
(function (EDebugPointId) {
    EDebugPointId["ON_SAVE_BUILT_ENTITIES"] = "ON_SAVE_BUILT_ENTITIES";
})(EDebugPointId = exports.EDebugPointId || (exports.EDebugPointId = {}));
var EDebugActionType;
(function (EDebugActionType) {
    EDebugActionType["CONSOLE_LOG"] = "CONSOLE_LOG";
    EDebugActionType["DEBUGGER"] = "DEBUGGER";
})(EDebugActionType = exports.EDebugActionType || (exports.EDebugActionType = {}));
exports.PebblebedGlobalConfig = new dynamic_config_store_1.ConfigStore({
    debug: false,
    debugActionType: EDebugActionType.DEBUGGER,
    debugPointIds: [],
}, "CONFIG_OVERRIDE_PEBBLEBED_GLOBAL_", "Pebblebed Global Config");
//# sourceMappingURL=PebblebedGlobalConfig.js.map