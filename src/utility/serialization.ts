export function reviveDateObjects(key, value) {
  if (isSerializedDate(value)) {
    return new Date(value);
  }

  return value;
}

const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function isSerializedDate(value) {
  return isString(value) && value.length > 15 && value.length < 30 && datePattern.test(value);
}

function isString(value) {
  return {}.toString.call(value) === "[object String]";
}
