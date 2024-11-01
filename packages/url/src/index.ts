import querystring, { ParsedUrlQueryInput } from "querystring";
import { PathPattern } from "@nano-router/path";
import type { PathValues } from "@nano-router/path";

type CreateUrlArgs = {
  origin?: string;
  pathname?: string;
  hash?: string;
  params?: PathValues;
  queryParams?: ParsedUrlQueryInput;
};

export const createUrl = ({
  origin = "",
  pathname = "/",
  hash = "",
  params,
  queryParams,
}: CreateUrlArgs) =>
  origin +
  new PathPattern(pathname).stringify(params) +
  objectToSearch(queryParams) +
  hash;

export const objectToSearch = (queryParams?: ParsedUrlQueryInput) => {
  const search = (queryParams && "?" + querystring.encode(queryParams)) || "";
  return search === "?" ? "" : search;
};

export const searchToObject = (search?: string) =>
  search ? querystring.decode(search.slice(1)) : {};
