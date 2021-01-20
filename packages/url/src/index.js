import decode from "querystring/decode.js";
import encode from "querystring/encode.js";
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
  const search = (queryParams && "?" + encode(queryParams)) || "";
  return search === "?" ? "" : search;
};

export const searchToObject = (search) =>
  search ? decode(search.slice(1)) : {};
