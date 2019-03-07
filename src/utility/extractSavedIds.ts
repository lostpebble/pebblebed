import { get } from "./BasicUtils";

export default function extractSavedIds(data): [{ generatedIds: string[] }] {
  const results = get(data, [0, "mutationResults"], null);

  const ids: string[] = [];

  if (results) {
    for (const result of results) {
      const paths = get(result, ["key", "path"], [null]);
      ids.push(get(paths, [paths.length - 1, "id"], null));
    }
  }

  data[0].generatedIds = ids;

  return data;
}
