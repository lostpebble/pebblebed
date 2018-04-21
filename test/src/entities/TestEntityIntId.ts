import { Pebblebed, types, } from "pebblebed";
import { DefaultDateTimeNow, ICoordinates } from "../dataTypes/dataTypes";

export interface IDSTestEntityIntId {
  idThing?: number;
  date?: Date;
  tags: string[];
  amount?: number;
  location?: ICoordinates;
  worthy?: boolean;
  object?: object;
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
}).setDefaultMeta({
  nullValueIfUnset: false,
});

export const TestEntityIntIdModel = Pebblebed.createModel("TestEntityIntId", schema);
