import { TReturnOnly } from "../";

export default function<T>(resultArray: T[], pickType: TReturnOnly): T|null {
  if (resultArray.length > 0) {
    if (pickType === "FIRST") {
      return resultArray[0];
    } else if (pickType === "LAST") {
      return resultArray[resultArray.length - 1];
    } else {
      const randomIndex = Math.floor(Math.random() * resultArray.length);
      return resultArray[randomIndex];
    }
  } else {
    return null;
  }
}
