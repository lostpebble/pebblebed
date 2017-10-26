import Core from "../Core";

export default function checkDatastore(operation: string) {
  if (Core.Instance.ds == null) {
    throw new Error("Datastore has not been connected to Pebblebed");
  }
}
