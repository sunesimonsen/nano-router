import querystring from "querystring";
import { PathPattern } from "@nano-router/path";

export const createUrl = ({
  origin = "",
  pathname = "/",
  hash = "",
  params,
  queryParams,
}) =>
  origin +
  new PathPattern(pathname).stringify(params) +
  objectToSearch(queryParams) +
  hash;

export const objectToSearch = (queryParams) => {
  const search = (queryParams && "?" + querystring.encode(queryParams)) || "";
  return search === "?" ? "" : search;
};

export const searchToObject = (search) =>
  search ? querystring.decode(search.slice(1)) : {};
