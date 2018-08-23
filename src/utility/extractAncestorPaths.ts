import { CreateMessage, throwError } from "../Messaging";

export default function extractAncestorPaths(model, ...args: any[]) {
  let ancestors: any[] = [];

  for (let i = 0; i < args.length; i += 2) {
    if (typeof args[i] === "string") {
      ancestors.push([args[i], args[i + 1]]);
    } else if (typeof args[i].entityKind === "string") {
      ancestors.push([args[i].entityKind, args[i + 1]]);
    } else {
      throwError(CreateMessage.INCORRECT_ANCESTOR_KIND(model));
    }
  }

  return ancestors;
}
