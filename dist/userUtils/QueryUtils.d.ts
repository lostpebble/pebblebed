import { DatastoreQueryRegular } from "..";
export interface IRunOnResultsOutput {
    continueQuery?: boolean;
    nextLimit?: number;
}
export interface IOPaginateThroughQueryOutput {
    total: number;
}
declare type TRunOnResultsFunction<T> = (results: T[], total: number) => (Promise<IRunOnResultsOutput | void>);
declare function paginateThroughQuery<T>(query: DatastoreQueryRegular<T>, runOnResults: TRunOnResultsFunction<T>): Promise<IOPaginateThroughQueryOutput>;
export declare const QueryUtils: {
    paginateThroughQuery: typeof paginateThroughQuery;
};
export {};
