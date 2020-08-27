import querystring from "querystring";
import { PathPattern } from "@nano-router/path";

export const createUrl = ({
  origin = "",
  basename = "/",
  hash = "",
  params,
  queryParams,
}) =>
  origin +
  stringifyPathPattern(basename, params) +
  objectToSearch(queryParams) +
  hash;

export const stringifyPathPattern = (pattern, params) =>
  new PathPattern(pattern).stringify(params);

export const objectToSearch = (queryParams) => {
  const search = (queryParams && "?" + querystring.encode(queryParams)) || "";
  return search === "?" ? "" : search;
};

export const searchToObject = (search) =>
  search ? querystring.decode(search.slice(1)) : {};
