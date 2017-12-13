import {
  PebbleArray, Pebblebed, PebbleBoolean, PebbleDateTime, PebbleDouble, PebbleGeoPoint,
  PebbleStringId, PebblebedModel, PebbleIntegerId
} from "pebblebed";

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

interface IDSTestEntityIntId {
  idThing: string;
  date: Date;
  tags: string[];
  amount: number;
  location: ICoordinates;
  worthy: boolean;
}

const schema = Pebblebed.createSchema<IDSTestEntityIntId>().setSchema({
  idThing: PebbleIntegerId(),
  amount: PebbleDouble(),
  date: PebbleDateTime(),
  location: PebbleGeoPoint(),
  tags: PebbleArray(),
  worthy: PebbleBoolean(),
});

export const TestEntityStringIdModel = new PebblebedModel("TestEntityStringId", schema);
