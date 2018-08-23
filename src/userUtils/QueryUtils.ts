import { DatastoreQueryRegular } from "..";
import Core from "../Core";

export interface IRunOnResultsOutput {
  continueQuery?: boolean;
  nextLimit?: number;
}

export interface IOPaginateThroughQueryOutput {
  total: number;
}

type TRunOnResultsFunction<T> = (results: T[], total: number) => (Promise<IRunOnResultsOutput | void>);

async function paginateThroughQuery<T>(query: DatastoreQueryRegular<T>, runOnResults: TRunOnResultsFunction<T>): Promise<IOPaginateThroughQueryOutput> {
  let more = true;
  let cursor: string | null = null;
  let nextLimit: number | undefined = undefined;
  let total = 0;

  while (more) {
    if (cursor != null) {
      query = query.start(cursor);
    }

    if (nextLimit != null) {
      query.limit(nextLimit);
    }

    const { entities, info } = await query.run();

    if (info.moreResults !== Core.Instance.dsModule.NO_MORE_RESULTS) {
      cursor = info.endCursor;
    } else {
      more = false;
    }

    total += entities.length;

    const runAgain = (await runOnResults(entities, total)) as IRunOnResultsOutput | undefined;

    if (runAgain != null) {
      nextLimit = runAgain.nextLimit;

      const { continueQuery = true } = runAgain;
      if (!continueQuery) {
        more = false;
      }
    }
  }

  return { total };
}

export const QueryUtils = {
  paginateThroughQuery,
};
