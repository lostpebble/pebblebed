import { IDSTestEntityIntId, TestEntityIntIdModel } from "../entities/TestEntityIntId";
import { IDSTestEntityStringId, TestEntityStringIdModel } from "../entities/TestEntityStringId";
import { inspect } from "util";
import { Pebblebed } from "pebblebed";
import { printMarkMeasurements, waitSeconds } from "../utility";
const { performance } = require("perf_hooks");

export async function runAllOperations() {
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

  // Generated Int ID
  console.log("\nSAVE: Generated Int ID Entity\n");
  performance.mark("START");

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
  console.log("\nSAVE: String ID Entity\n", inspect(await TestEntityStringIdModel.save(entityString).run()));
  performance.mark("SAVE:STRING_ID");

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

  console.log("\nWaiting 3 seconds\n");
  await waitSeconds(3);
  performance.mark("WAITED_AFTER_LOAD");

  console.log(
    `\nQUERY: Tag Int ID Entities`,
    inspect(await TestEntityIntIdModel.query().filter("tags", "=", "blue").run())
  );
  performance.mark("QUERY:TAGS_INT_ID");

  console.log(
    `\nQUERY: Amount INT ID Entities, limited -> 3`,
    inspect(await TestEntityIntIdModel.query().filter("amount", "<", 20).limit(3).run())
  );
  performance.mark("QUERY:AMOUNT_INT_ID");

  console.log(
    `\nQUERY: Date, String ID Entities, limited -> 3`,
    inspect(await TestEntityStringIdModel.query().filter("date", "<", new Date()).limit(3).run())
  );
  performance.mark("QUERY:DATE_STRING_ID");

  printMarkMeasurements(performance.getEntriesByType("mark"));
}
