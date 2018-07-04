import { Pebblebed, types, } from "pebblebed";
import { DefaultDateTimeNow, ICoordinates } from "../dataTypes/dataTypes";
import { reviveDateObjects } from "../../../src/utility/serialization";

export interface IDSTestEntityIntId {
  idThing?: number;
  date?: Date;
  tags: string[];
  amount?: number;
  location?: ICoordinates;
  worthy?: boolean;
  object?: object;
  testSerialization?: {
    time: Date;
    [key: string]: any;
  };
}

const schema = Pebblebed.createSchema<IDSTestEntityIntId>({
  idThing: types.integerId(),
  amount: types.double(),
  date: DefaultDateTimeNow,
  location: types.geoPoint(),
  tags: types.array(),
  worthy: types.boolean({
    indexed: false,
  }),
  object: types.object({
    indexed: false,
  }),
  testSerialization: types.serializedJson({
    indexed: false,
    reviver: reviveDateObjects,
  }),
}).setDefaultMeta({
  nullValueIfUnset: false,
});

export const TestEntityIntIdModel = Pebblebed.createModel("TestEntityIntId", schema);
