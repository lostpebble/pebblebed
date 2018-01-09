import { TestEntityIntIdModel } from "../entities/TestEntityIntId";
import { assertEqual } from "../utility";

export async function testPickingOut() {
  const ids = ["123", "5704093720903680", "5707532110659584", "5711129414205440"];

  const result = await TestEntityIntIdModel.load(ids).run();
  console.log(result);

  const resultOne = await TestEntityIntIdModel.load(ids).first().run();
  console.log(resultOne);

  const resultLast = await TestEntityIntIdModel.load(ids).last().run();
  console.log("last");
  console.log(resultLast);

  const resultRandom = await TestEntityIntIdModel.load(ids).randomOne().run();
  console.log("random");
  console.log(resultRandom);

  const baseQuery = TestEntityIntIdModel.query().filter("tags", "=", "red").enableCache(true);

  const queryResult = await baseQuery.limit(5).run();
  console.log("query all");
  console.log(queryResult);

  const queryResultFirst = await baseQuery.first().limit(5).run();
  console.log(queryResultFirst);
  assertEqual("Compare query using first() with first entity from same query returning all entities", queryResultFirst.idThing, queryResult.entities[0].idThing);

  const queryResultLast = await baseQuery.last().limit(5).run();
  console.log(queryResultLast);
  assertEqual("Compare query using last() with last entity from same query returning all entities", queryResultLast.idThing, queryResult.entities[queryResult.entities.length - 1].idThing);

  const queryResultRandom = await baseQuery.randomOne().limit(5).run();
  console.log("query random");
  console.log(queryResultRandom);
}