import { waitSeconds } from "./utility";

console.log("Pebbledbed: Running tests");

import "./setupPebblebed";
import { runAllOperations } from "./tests/_allOperations";
import { Pebblebed, PebblebedDefaultRedisCacheStore } from "pebblebed";
import * as IoRedisLib from "ioredis";

const redis = new IoRedisLib();

process.on("unhandledRejection", (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  console.error(reason);
});

async function runTests() {

  console.log("Running allOperations");

  // await runAllOperations("BASIC_NO_CACHE");

  await redis.flushall();

  Pebblebed.setCacheStore(new PebblebedDefaultRedisCacheStore(redis));

  await runAllOperations("DEFAULT_REDIS_CACHE");

  console.log("Finished");
  // const entities = await TestEntityStringIdModel.load("123").run();

  // console.dir(entities);
}

runTests();