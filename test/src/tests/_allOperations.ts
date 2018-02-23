import { IDSTestEntityIntId, TestEntityIntIdModel } from "../entities/TestEntityIntId";
import { IDSTestEntityStringId, TestEntityStringIdModel } from "../entities/TestEntityStringId";
import { inspect } from "util";
import { Pebblebed } from "pebblebed";
import { printMarkMeasurements, waitSeconds } from "../utility";
const { performance } = require("perf_hooks");
const datastore = require("@google-cloud/datastore");

const doubleQueryValue = datastore.double(20);

export async function runAllOperations(prefix: string = "") {
  const entityGenerated: IDSTestEntityIntId = {
    amount: 10,
    tags: ["what"],
  };

  const entityIntegerId: IDSTestEntityIntId = {
    idThing: 123,
    amount: 20,
    tags: ["what", "blue"],
  };

  const entityString: IDSTestEntityStringId = {
    idThing: "123abc",
    amount: 30,
    tags: ["what", "blue", "thing"],
    location: {
      latitude: 12.0,
      longitude: 12.0,
    },
  };

  const entityStringTwo: IDSTestEntityStringId = {
    idThing: "abc123",
    amount: 35,
    tags: ["what", "red", "stuff"],
    location: {
      latitude: 14.0,
      longitude: 14.0,
    },
  };

  // Generated Int ID
  console.log("\nSAVE: Generated Int ID Entity\n");
  performance.mark(`START${prefix.length ? `_${prefix}` : ""}`);

  let result = await TestEntityIntIdModel.save(entityGenerated).generateUnsetIds().run();
  performance.mark("SAVE:GENERATED_INT_ID");

  console.log(inspect(result));

  const firstGeneratedId = result.generatedIds[0];

  // Deliberate Int ID
  console.log("\nSAVE: Set Int ID Entity\n", inspect(await TestEntityIntIdModel.save(entityIntegerId).run()));
  performance.mark("SAVE:SET_INT_ID");

  // Mixed Generated Int ID and deliberate Int ID
  console.log(
    "\nSAVE: Mixed Generated / Set Int ID Entities\n",
    inspect(await TestEntityIntIdModel.save([entityGenerated, entityIntegerId]).generateUnsetIds().run())
  );
  performance.mark("SAVE:MIXED_GENERATED_SET_INT_IDS");

  // Deliberately set String ID
  console.log("\nSAVE: String ID Entity Single\n", inspect(await TestEntityStringIdModel.save(entityString).run()));
  performance.mark("SAVE:STRING_ID_SINGLE");

  console.log("\nSAVE: String ID Entity Multiple\n", inspect(await TestEntityStringIdModel.save([entityString, entityStringTwo]).run()));
  performance.mark("SAVE:STRING_ID_MULTIPLE");

  console.log("\nWaiting 2 seconds\n");
  await waitSeconds(2);
  performance.mark("WAITED_AFTER_SAVE");

  console.log(
    "\nLOAD: First Generated ID Entity\n",
    inspect(await TestEntityIntIdModel.load(firstGeneratedId).run())
  );
  performance.mark("LOAD:GENERATED_INT_ID");

  console.log("\nLOAD: Int ID Entity\n", inspect(await TestEntityIntIdModel.load(123).run()));
  performance.mark("LOAD:SET_INT_ID");

  console.log("\nLOAD: String ID Entity\n", inspect(await TestEntityStringIdModel.load("123abc").run()));
  performance.mark("LOAD:STRING_ID");

  const loadKeys = [
    Pebblebed.key(TestEntityIntIdModel, firstGeneratedId),
    Pebblebed.key(TestEntityIntIdModel, 123),
  ];

  console.log("\nCREATED KEYS:\n", inspect(loadKeys, false, 6));

  console.log(
    "\nLOAD: Mixed Keys for both Set and Generated Int ID Entities\n",
    inspect(await TestEntityIntIdModel.load(loadKeys).run())
  );
  performance.mark("LOAD:MIXED_GENERATED_SET_INT_IDS");

  console.log("\nWaiting 2 seconds\n");
  await waitSeconds(2);
  performance.mark("WAITED_AFTER_LOAD");

  console.log(
    `\nQUERY: Tag Int ID Entities`,
    inspect(await TestEntityIntIdModel.query().filter("tags", "=", "blue").run())
  );
  performance.mark("QUERY:TAGS_INT_ID");

  let query = await TestEntityIntIdModel.query().filter("amount", "<", 20).limit(4).run();

  console.log(
    `\nQUERY: Amount INT ID Entities, limited -> 3`,
    inspect(query)
  );
  performance.mark("QUERY:AMOUNT_INT_ID");

  query = await TestEntityIntIdModel.query().filter("amount", "<", 20).limit(4).run();

  console.log(
    `\nQUERY: (same) CACHE test amount INT ID Entities, limited -> 3`,
    inspect(query)
  );
  performance.mark("TEST_CACHE_QUERY:AMOUNT_INT_ID");

  const changeEntity: IDSTestEntityIntId = query.entities.pop();

  changeEntity.worthy = true;
  changeEntity.tags = ["new", "slang"];

  console.log(
    `\nCHANGE_AND_SAVE_QUERIED_ENTITY: Popped entity off last query from INT ID Entities`,
    inspect(await TestEntityIntIdModel.save(changeEntity).run())
  );
  performance.mark("CHANGE_AND_SAVE_QUERIED_ENTITY:AMOUNT_INT_ID");

  console.log(
    `\nQUERY: Date, String ID Entities, limited -> 3`,
    inspect(await TestEntityStringIdModel.query().filter("date", "<", new Date()).limit(3).run())
  );
  performance.mark("QUERY:DATE_STRING_ID");

  console.log(`\nDELETE: (By Objects) Queried Int Entities`, inspect(await TestEntityIntIdModel.delete(query.entities).run(), false, 6));
  performance.mark("DELETE:BY_OBJECTS:QUERIED_AMOUNT_INT_IDS");

  console.log("\nLOAD: Test Cache (before delete) String ID Entity\n", inspect(await TestEntityStringIdModel.load("abc123").run()));
  performance.mark("TEST_CACHE_LOAD_BEFORE_DELETE:STRING_ID");

  console.log(`\nDELETE: (By id) String Entity`, inspect(await TestEntityStringIdModel.delete().ids(["abc123"]).run(), false, 6));
  performance.mark("DELETE:BY_ID:STRING_ID");

  console.log("\nWaiting 2 seconds\n");
  await waitSeconds(2);
  performance.mark("WAITED_AFTER_DELETE");

  console.log("\nLOAD: Test Cache (after delete) String ID Entity\n", inspect(await TestEntityStringIdModel.load("abc123").run()));
  performance.mark("TEST_CACHE_LOAD_AFTER_DELETE:STRING_ID");

  printMarkMeasurements(performance.getEntriesByType("mark"), prefix);

  performance.clearMarks();
}