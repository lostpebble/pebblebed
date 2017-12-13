"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicUtils_1 = require("./utility/BasicUtils");
const Core_1 = require("./Core");
const Messaging_1 = require("./Messaging");
const PebblebedValidation_1 = require("./validation/PebblebedValidation");
exports.Pebblebed = {
    connectDatastore: (datastore) => {
        Core_1.default.Instance.setDatastore(datastore);
        console.log("Connecting Pebbledbed to Datastore");
    },
    transaction: () => {
        return Core_1.default.Instance.ds.transaction();
    },
    createSchema: () => {
        return new PebblebedValidation_1.PebblebedJoiSchema();
    },
    setCacheStore: (cacheStore) => {
        Core_1.default.Instance.setCacheStore(cacheStore);
    },
    setDefaultNamespace: (namespace) => {
        if (namespace != null) {
            if (typeof namespace === "string") {
                if (namespace.length > 0) {
                    Core_1.default.Instance.setNamespace(namespace);
                }
                else {
                    Core_1.default.Instance.setNamespace(null);
                }
            }
            else {
                Messaging_1.throwError(Messaging_1.CreateMessage.SET_NAMESPACE_INCORRECT);
            }
        }
        else {
            Core_1.default.Instance.setNamespace(null);
        }
    },
    setDefaultCachingSeconds: (seconds) => {
        Core_1.default.Instance.defaultCachingSeconds = seconds;
    },
    enableValidations(on = true) {
        Core_1.default.Instance.enableValidations(on);
    },
    enableCaching(on = true) {
        Core_1.default.Instance.enableCaching(on);
    },
    key(...args) {
        const keyPath = [];
        let currentIdType = "unknown";
        for (let i = 0; i < args.length; i += 1) {
            if (i % 2 === 0) {
                if (typeof args[i] !== "string") {
                    keyPath.push(args[i].entityKind);
                    currentIdType = args[i].entityIdType;
                }
                else {
                    keyPath.push(args[i]);
                }
            }
            else {
                if (currentIdType === "int") {
                    keyPath.push(Core_1.default.Instance.dsModule.int(args[i]));
                }
                else {
                    keyPath.push(args[i]);
                }
                currentIdType = "unknown";
            }
        }
        if (Core_1.default.Instance.namespace != null) {
            return Core_1.default.Instance.ds.key({
                path: keyPath,
                namespace: Core_1.default.Instance.namespace,
            });
        }
        return Core_1.default.Instance.ds.key(keyPath);
    },
    keysFromObjectArray(sourceArray, ...args) {
        if (args.length % 2 !== 0) {
            Messaging_1.throwError(Messaging_1.CreateMessage.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
        }
        return sourceArray.map(source => {
            const keyPath = [];
            for (let i = 0; i < args.length; i += 2) {
                keyPath.push(args[i], source[args[i + 1]]);
            }
            return exports.Pebblebed.key(...keyPath);
        });
    },
    uniqueKeysFromObjectArray(sourceArray, ...args) {
        if (args.length % 2 !== 0) {
            Messaging_1.throwError(Messaging_1.CreateMessage.INCORRECT_ARGUMENTS_KEYS_FROM_ARRAY);
        }
        const obj = {};
        const keys = [];
        for (const source of sourceArray) {
            const keyPath = [];
            const kindKeyPath = [];
            for (let i = 0; i < args.length; i += 2) {
                keyPath.push(args[i], source[args[i + 1]]);
                kindKeyPath.push(args[i].entityKind, source[args[i + 1]]);
            }
            if (BasicUtils_1.get(obj, kindKeyPath, false) === false) {
                keys.push(exports.Pebblebed.key(...keyPath));
                BasicUtils_1.set(obj, kindKeyPath, true);
            }
        }
        return keys;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGViYmxlYmVkLmpzIiwic291cmNlUm9vdCI6IkQ6L0Rldi9fUHJvamVjdHMvR2l0aHViL3BlYmJsZWJlZC9zcmMvIiwic291cmNlcyI6WyJQZWJibGViZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxxREFBZ0Q7QUFDaEQsaUNBQTBCO0FBQzFCLDJDQUF3RDtBQUN4RCwwRUFBc0U7QUFHekQsUUFBQSxTQUFTLEdBQUc7SUFDdkIsZ0JBQWdCLEVBQUUsQ0FBQyxTQUFjO1FBQy9CLGNBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXRDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsV0FBVyxFQUFFO1FBQ1gsTUFBTSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxZQUFZLEVBQUU7UUFDWixNQUFNLENBQUMsSUFBSSx3Q0FBa0IsRUFBSyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxhQUFhLEVBQUUsQ0FBQyxVQUErQjtRQUM3QyxjQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsbUJBQW1CLEVBQUUsQ0FBQyxTQUFpQjtRQUNyQyxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxPQUFPLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLGNBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLGNBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFD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QyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBWSxDQUFDLENBQUMsQ0FBQztnQkFDdEQsV0FBVyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFvQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQVksQ0FBQyxDQUFDLENBQUM7WUFDM0YsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLGdCQUFHLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDckMsZ0JBQUcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRixDQUFDIn0=