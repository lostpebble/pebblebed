import Core from "../Core";
import { throwError } from "../Messaging";

export default function checkDatastore(operation: string) {
  if (Core.Instance.ds == null) {
    throwError("Datastore has not been connected to Pebblebed");
  }
}
