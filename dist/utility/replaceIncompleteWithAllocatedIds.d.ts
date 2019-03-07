import { IPebblebedSaveEntity } from "..";
export default function replaceIncompleteWithAllocatedIds<T>(entities: IPebblebedSaveEntity<T>[], transaction?: any | null): Promise<{
    ids: (string | null)[];
    newEntities: IPebblebedSaveEntity<T>[];
}>;
