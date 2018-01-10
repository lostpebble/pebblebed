import { TReturnOnly } from "../";

export default function(resultArray: any[], pickType: TReturnOnly) {
  console.log(`Got ${pickType}`);

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
