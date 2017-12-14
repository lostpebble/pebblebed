import {
  PebbleArray, Pebblebed, PebblebedModel, PebbleBoolean, PebbleDouble, PebbleGeoPoint,
  PebbleIntegerId
} from "pebblebed";
import { DefaultDateTimeNow, ICoordinates } from "../dataTypes/dataTypes";

export interface IDSTestEntityIntId {
  idThing?: number;
  date?: Date;
  tags: string[];
  amount?: number;
  location?: ICoordinates;
  worthy?: boolean;
}

const schema = Pebblebed.createSchema<IDSTestEntityIntId>({
  idThing: PebbleIntegerId(),
  amount: PebbleDouble(),
  date: DefaultDateTimeNow,
  location: PebbleGeoPoint(),
  tags: PebbleArray(),
  worthy: PebbleBoolean(),
}).setDefaultMeta({
  nullValueIfUnset: false,
});

export const TestEntityIntIdModel = Pebblebed.createModel("TestEntityIntId", schema);
