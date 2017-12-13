import { waitSeconds } from "./utility";

console.log("Pebbledbed: Running tests");

import "./setupPebblebed";
import { TestEntityStringIdModel } from "./entities/TestEntityStringId";

async function something() {
  console.log("Starting something");

  await waitSeconds(2);

  console.log("Waited 2 seconds");

  const entities = await TestEntityStringIdModel.load("123").run();

  console.dir(entities);
}

something();