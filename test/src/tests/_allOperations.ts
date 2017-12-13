import { IDSTestEntityIntId, TestEntityIntIdModel } from "../entities/TestEntityIntId";
import { IDSTestEntityStringId, TestEntityStringIdModel } from "../entities/TestEntityStringId";
import { inspect } from "util";
import { Pebblebed } from "pebblebed";

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
    }
  };

  // Generated Int ID
  console.log("\nSAVE: Generated Int ID Entity\n");

  let result = await TestEntityIntIdModel.save(entityGenerated).generateUnsetIds().run();

  console.log(inspect(result));

  const firstGeneratedId = result.generatedIds[0];

  // Deliberate Int ID
  console.log("\nSAVE: Set Int ID Entity\n", inspect(await TestEntityIntIdModel.save(entityIntegerId).run()));

  // Mixed Generated Int ID and deliberate Int ID
  console.log("\nSAVE: Mixed Generated / Set Int ID Entities\n", inspect(await TestEntityIntIdModel.save([entityGenerated, entityIntegerId]).generateUnsetIds().run()));

  // Deliberately set String ID
  console.log("\nSAVE: String ID Entity\n", inspect(await TestEntityStringIdModel.save(entityString).run()));

  console.log("\nWaiting 2 seconds\n");

  console.log("\nLOAD: First Generated ID Entity\n", inspect(await TestEntityIntIdModel.load(firstGeneratedId).run()));

  console.log("\nLOAD: Int ID Entity\n", inspect(await TestEntityIntIdModel.load(123).run()));

  console.log("\nLOAD: String ID Entity\n", inspect(await TestEntityStringIdModel.load("123abc").run()));

  const loadKeys = [Pebblebed.key(TestEntityIntIdModel, firstGeneratedId), Pebblebed.key(TestEntityIntIdModel, 123)];

  console.log("\nCREATED KEYS:\n", inspect(loadKeys, false, 6));

  console.log(loadKeys[0].path);

  console.log("\nLOAD: Mixed Keys for both Set and Generated Int ID Entities\n", inspect(await TestEntityIntIdModel.load(loadKeys).run()));

  console.log("\nWaiting 2 seconds\n");
}
