/* eslint-disable @typescript-eslint/no-explicit-any */
interface PopulateOptions {
  /** space delimited path(s) to populate */
  path: string;
  /** fields to select */
  select?: any;
  /** query conditions to match */
  match?: any;
  /** correct limit on populated array */
  perDocumentLimit?: number;
  /** optional boolean, set to `false` to allow populating paths that aren't in the schema */
  strictPopulate?: boolean;
}
export interface FindMany {
  search?: string[];
  sort?: string[];
  populate?: Array<string | PopulateOptions>;
  offset?: number;
  limit?: number;
  page?: number;
  lean?: boolean;
  select?: string[];
}

export interface FindOne extends Pick<FindMany, 'populate' | 'select'> {
  id?: string;
  lean?: boolean;
  session?: any;
  increaseView?: boolean;
}
