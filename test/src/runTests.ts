import { waitSeconds } from "./utility";

console.log("Pebbledbed: Running tests");

import "./setupPebblebed";
import { runAllOperations } from "./tests/_allOperations";
import { Pebblebed, PebblebedDefaultRedisCacheStore } from "pebblebed";
import * as IoRedisLib from "ioredis";
import { IDSTestEntityIntId, TestEntityIntIdModel } from "./entities/TestEntityIntId";
import { TestEntityStringIdModel } from "./entities/TestEntityStringId";

const redis = new IoRedisLib();

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  console.error(reason);
});

async function runTests() {
  console.log("Running allOperations");

  /*const values = [12, 53, 542];
  const createEntities: IDSTestEntityIntId[] = [];

  for (const value of values) {
    createEntities.push({
      tags: ["blue", "red"],
      amount: value,
      date: new Date(),
      location: {
        longitude: 1,
        latitude: 0,
      },
      worthy: false,
      object: {
        something: 0,
      },
    });
  }

  await TestEntityIntIdModel.save(createEntities)
    .withAncestors(TestEntityStringIdModel, "abc")
    .generateUnsetIds()
    .run();

  await waitSeconds(2);
*/
  // return;
  Pebblebed.setCacheStore(new PebblebedDefaultRedisCacheStore(redis));

  const ids = ["123", "5704093720903680", "5707532110659584", "5711129414205440"];

  const result = await TestEntityIntIdModel.load(ids).run();
  console.log(result);

  const resultOne = await TestEntityIntIdModel.load(ids).first().run();
  console.log(resultOne);

  const resultLast = await TestEntityIntIdModel.load(ids).last().run();
  console.log(resultLast);

  const resultRandom = await TestEntityIntIdModel.load(ids).randomOne().run();
  console.log(resultRandom);

  // await runAllOperations("BASIC_NO_CACHE");

  await redis.flushall();

  // await runAllOperations("DEFAULT_REDIS_CACHE");
  // await runAllOperations("SECOND_RUN_DEFAULT_REDIS_CACHE");

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
