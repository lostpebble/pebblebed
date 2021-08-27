import { IPebblebedSaveEntity } from "..";
import { Transaction } from "@google-cloud/datastore";
export default function replaceIncompleteWithAllocatedIds<T>(entities: IPebblebedSaveEntity<T>[], transaction?: Transaction | null): Promise<{
    ids: (string | null)[];
    newEntities: IPebblebedSaveEntity<T>[];
}>;
