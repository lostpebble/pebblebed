import {
  PebbleArray, Pebblebed, PebbleBoolean, PebbleDateTime, PebbleDouble, PebbleGeoPoint,
  PebbleStringId, PebblebedModel, PebbleIntegerId
} from "pebblebed";
import { DefaultDateTimeNow, ICoordinates } from "../dataTypes/dataTypes";

interface IDSTestEntityIntId {
  idThing?: string;
  date?: Date;
  tags: string[];
  amount?: number;
  location?: ICoordinates;
  worthy?: boolean;
}

const schema = Pebblebed.createSchema<IDSTestEntityIntId>().setDefaultMeta({
  nullValueIfUnset: false,
}).setSchema({
  idThing: PebbleIntegerId(),
  amount: PebbleDouble(),
  date: DefaultDateTimeNow,
  location: PebbleGeoPoint(),
  tags: PebbleArray(),
  worthy: PebbleBoolean(),
});

export const TestEntityStringIdModel = new PebblebedModel("TestEntityStringId", schema);
