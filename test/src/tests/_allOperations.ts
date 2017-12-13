import { IDSTestEntityIntId, TestEntityIntIdModel } from "../entities/TestEntityIntId";
import { IDSTestEntityStringId, TestEntityStringIdModel } from "../entities/TestEntityStringId";
import { inspect } from "util";

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
  console.log("SAVE: Generated Int ID Entity", inspect(await TestEntityIntIdModel.save(entityGenerated).generateUnsetIds().run(), true, 4));

  // Deliberate Int ID
  console.log("SAVE: Set Int ID Entity", inspect(await TestEntityIntIdModel.save(entityIntegerId).run(), true, 4));

  // Mixed Generated Int ID and deliberate Int ID
  console.log("SAVE: Mixed Generated / Set Int ID Entities", inspect(await TestEntityIntIdModel.save([entityGenerated, entityIntegerId]).generateUnsetIds().run(), true, 4));

  // Deliberately set String ID
  console.log("SAVE: String ID Entity", inspect(await TestEntityStringIdModel.save(entityString).run(), true, 4));
}
