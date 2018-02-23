import {
  Pebblebed,
  PebbleStringId,
  PebbleString,
  PebbleArray,
  PebbleDouble,
  PebblebedModel,
  PebbleDateTime,
} from "pebblebed";
import { waitSeconds } from "../utility";

interface DSCandy {
  candyName: string;
  description: string;
  type: string;
  colors: string[];
  shape: "ROUNDED" | "RECTANGULAR";
  tasteRating?: number;
  dateIntroduced: Date;
}

export async function runExample() {
  const schema = Pebblebed.createSchema<DSCandy>({
    candyName: PebbleStringId(),
    description: PebbleString({
      indexed: false,
    }),
    type: PebbleString().required(),
    colors: PebbleArray(),
    shape: PebbleString().only(["ROUNDED", "RECTANGULAR"]),
    tasteRating: PebbleDouble()
      .min(0)
      .max(10)
      .default(5),
    dateIntroduced: PebbleDateTime(),
  });

  const CandyModel = new PebblebedModel("Candy", schema);

  const candies: DSCandy[] = [
    {
      candyName: "choco-nut",
      description: "A delicate brown and white chocolate with a nut on top",
      type: "CHOCOLATE",
      colors: ["BROWN", "WHITE"],
      shape: "RECTANGULAR",
      tasteRating: 7.5,
      dateIntroduced: new Date("2011-01-22"),
    },
    {
      candyName: "funky-swirl",
      description: "A rebellious cookie with swirly candy stripes",
      type: "COOKIE",
      colors: ["RED", "BLUE", "WHITE"],
      shape: "ROUNDED",
      tasteRating: 6.5,
      dateIntroduced: new Date("2015-05-01"),
    },
    {
      candyName: "tooth-breaker",
      description: "Hard-boiled candy that lasts a lifetime - don't try biting",
      type: "HARD CANDY",
      colors: ["YELLOW", "RED", "GREEN"],
      shape: "ROUNDED",
      dateIntroduced: new Date("1988-08-13"),
    },
    {
      candyName: "just-one-more",
      description: "A chocolate cookie that melts in your mouth, sprinkled with small chocolate smarties",
      colors: ["BROWN", "YELLOW", "BLUE", "RED", "GREEN"],
      type: "COOKIE",
      shape: "ROUNDED",
      tasteRating: 8,
      dateIntroduced: new Date("2018-02-23"),
    },
  ];

  await CandyModel.save(candies).run();

  await waitSeconds(3);
}
