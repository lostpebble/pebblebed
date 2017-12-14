import { waitSeconds } from "./utility";

console.log("Pebbledbed: Running tests");

import "./setupPebblebed";
import { runAllOperations } from "./tests/_allOperations";
import { Pebblebed, PebblebedDefaultRedisCacheStore } from "pebblebed";
import * as IoRedisLib from "ioredis";

async function runTests() {

  console.log("Running allOperations");

  await runAllOperations("BASIC_NO_CACHE");

  Pebblebed.setCacheStore(new PebblebedDefaultRedisCacheStore(new IoRedisLib()));

  await runAllOperations("DEFAULT_REDIS_CACHE");

  console.log("Finished");
  // const entities = await TestEntityStringIdModel.load("123").run();

  // console.dir(entities);
}

runTests();