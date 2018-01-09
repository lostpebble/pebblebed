import { TReturnOnly } from "../";

export default function(resultArray: any[], pickType: TReturnOnly) {
  console.log(`Got ${pickType}`);

  if (resultArray.length > 0) {
    if (pickType === "FIRST") {
      console.log(`Picking first`);
      return resultArray[0];
    } else if (pickType === "LAST") {
      console.log(`Picking last`);
      return resultArray[resultArray.length - 1];
    } else {
      console.log(`Picking random`);
      const randomIndex = Math.floor(Math.random() * resultArray.length);
      return resultArray[randomIndex];
    }
  } else {
    return null;
  }
}
