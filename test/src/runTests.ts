import { waitSeconds } from "./utility";

console.log("Pebbledbed: Running tests");

import "./setupPebblebed";
import { runAllOperations } from "./tests/_allOperations";

async function runTests() {

  console.log("Running allOperations");

  await runAllOperations();

  console.log("Finished");
  // const entities = await TestEntityStringIdModel.load("123").run();

  // console.dir(entities);
}

runTests();