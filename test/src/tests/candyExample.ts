import { Pebblebed, PebbleStringId, PebbleString, PebbleArray, PebbleDouble } from "pebblebed";
import PebblebedModel from "../../../src/PebblebedModel";

const schema = Pebblebed.createSchema({
  candyName: PebbleStringId(),
  description: PebbleString({
    indexed: false,
  }),
  type: PebbleDouble().min(0).max(10),
  colors: PebbleArray(),
  shape: PebbleString().only(["ROUNDED", "RECTANGULAR"]),
});

const CandyModel = new PebblebedModel("Candy", schema);

