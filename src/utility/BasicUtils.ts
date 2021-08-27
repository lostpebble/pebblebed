export function get(obj, path, defaultValue) {
  let cur = obj;

  for (let i = 0; i < path.length; i += 1) {
    if (cur == null) {
      return defaultValue;
    }

    if (typeof path[i] === "number") {
      if (Array.isArray(cur) && cur.length > path[i]) {
        cur = cur[path[i]];
      } else {
        return defaultValue;
      }
    } else if (typeof path[i] === "string") {
      if (cur.hasOwnProperty(path[i])) {
        cur = cur[path[i]];
      } else {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  }

  return cur;
}

export function set(obj, path, value) {
  if (path.length === 1) {
    obj[path[0]] = value;
    return obj;
  }

  if (obj[path[0]] == null) {
    obj[path[0]] = {};
  }

  obj[path[0]] = set(obj[path[0]], path.slice(1), value);
  return obj;
}

export function isNumber(value): value is number {
  return Number.isInteger(value) || /^\d+$/.test(value);
}
