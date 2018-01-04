import path from "path";
import { PebbleTreeFactory } from "../pebbletree-library/PebbleTree";

export const PebbleTree = new PebbleTreeFactory({
  debug: true,
});

PebbleTree.createTree(path.join(__dirname, "./structure"));
