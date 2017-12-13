import {
  PebbleArray, Pebblebed, PebbleBoolean, PebbleDateTime, PebbleDouble, PebbleGeoPoint,
  PebbleStringId, PebblebedModel
} from "pebblebed";
import { DefaultDateTimeNow, ICoordinates } from "../dataTypes/dataTypes";

interface IDSTestEntityStringId {
  idThing: string;
  date?: Date;
  tags: string[];
  amount?: number;
  location?: ICoordinates;
  worthy?: boolean;
}

const schema = Pebblebed.createSchema<IDSTestEntityStringId>().setSchema({
  idThing: PebbleStringId(),
  amount: PebbleDouble(),
  date: DefaultDateTimeNow,
  location: PebbleGeoPoint(),
  tags: PebbleArray().required(),
  worthy: PebbleBoolean(),
});

export const TestEntityStringIdModel = new PebblebedModel("TestEntityStringId", schema);
