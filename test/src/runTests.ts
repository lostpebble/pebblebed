import { waitSeconds } from "./utility";

console.log("Pebbledbed: Running tests");

import "./setupPebblebed";
import { runAllOperations } from "./tests/_allOperations";
import { Pebblebed, PebblebedDefaultRedisCacheStore } from "pebblebed";
import * as IoRedisLib from "ioredis";
import { IDSTestEntityIntId, TestEntityIntIdModel } from "./entities/TestEntityIntId";
import { TestEntityStringIdModel } from "./entities/TestEntityStringId";
import { testPickingOut } from "./tests/_testPickingOut";
import { runExample } from "./tests/candyExample";

const redis = new IoRedisLib();

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  console.error(reason);
});

async function runTests() {
  console.log("Running allOperations");

  await runAllOperations("BASIC_NO_CACHE");

  await redis.flushall();

  Pebblebed.setCacheStore(new PebblebedDefaultRedisCacheStore(redis));

  await runAllOperations("DEFAULT_REDIS_CACHE");
  await runAllOperations("SECOND_RUN_DEFAULT_REDIS_CACHE");

  await testPickingOut();

  console.log("Finished");

  /*const values = [12, 53, 542, 23, 90];
  const createEntities: IDSTestEntityIntId[] = [];

  for (const value of values) {
    createEntities.push({
      tags: ["blue", "red"],
      amount: value,
      date: new Date(),
      location: {
        longitude: 0,
        latitude: 0,
      },
      worthy: false,
    });
  }

  await TestEntityIntIdModel.save(createEntities)
    .withAncestors(TestEntityStringIdModel, "abc")
    .generateUnsetIds()
    .run();

  await waitSeconds(2);

  const queryResponse = await TestEntityIntIdModel.query()
    .filter("tags", "=", "blue")
    .withAncestors(TestEntityStringIdModel, "abc")
    .limit(3)
    // .order("date", { descending: false })
    .run();

  console.log(queryResponse);

  let queryResponseTwo = await TestEntityIntIdModel.query()
    .withAncestors(TestEntityStringIdModel, "abc")
    .limit(6)
    .start(queryResponse.info.endCursor)
    .run();

  console.log(queryResponseTwo);

  await waitSeconds(1);

  queryResponseTwo = await TestEntityIntIdModel.query()
    .withAncestors(TestEntityStringIdModel, "abc")
    .limit(6)
    .start(queryResponse.info.endCursor)
    .run();

  console.log(queryResponseTwo);

  console.log(await TestEntityIntIdModel.delete(queryResponseTwo.entities).run());*/

  // const entities = await TestEntityStringIdModel.load("123").run();

  // console.dir(entities);
}

runTests();
//
// runExample();