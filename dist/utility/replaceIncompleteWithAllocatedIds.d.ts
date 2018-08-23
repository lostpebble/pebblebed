export default function replaceIncompleteWithAllocatedIds(entities: any, transaction?: any | null): Promise<{
    ids: (string | null)[];
    newEntities: any;
}>;
