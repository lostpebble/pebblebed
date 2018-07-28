import { IDSTestEntityIntId, TestEntityIntIdModel } from "../entities/TestEntityIntId";
import { Pebblebed } from "../../../src";
import { waitSeconds } from "../utility";

export async function runCachingSerializationTests() {
  Pebblebed.setCacheEnabledDefaults({
    onLoad: false,
    onSave: false,
    onQuery: false,
  });

  const testEntity: IDSTestEntityIntId = {
    amount: 1.2334342,
    date: new Date(),
    idThing: 123123,
    location: {
      latitude: 12.123,
      longitude: 32.3212,
    },
    object: {},
    tags: ["red", "green", "egg"],
    worthy: false,
    testSerialization: {
      time: new Date(),
      something: "else",
    }
  };

  await TestEntityIntIdModel.save(testEntity).run();

  console.log(testEntity);

  await waitSeconds(2);

  const checkIt = await TestEntityIntIdModel.load(123123).first().run(true);

  console.log(`Loaded entity without cache enabled`);
  console.log(checkIt);

  await waitSeconds(2);

  await TestEntityIntIdModel.save(checkIt).enableCaching(true).cachingSeconds(1200).run();

  console.log(`Saved Loaded entity with cache enabled`);

  await waitSeconds(2);

  const cachedEntity = await TestEntityIntIdModel.load(123123).enableCaching(true).cachingSeconds(1200).first().run();

  console.log(`Loaded entity from cache hopefully.`);
  console.log(cachedEntity);

  const testToFixed = cachedEntity.amount.toFixed(2);
  const testCoordinatesLat = cachedEntity.location.latitude;
  const testCoordinatesLng = cachedEntity.location.longitude.toFixed(2);
}