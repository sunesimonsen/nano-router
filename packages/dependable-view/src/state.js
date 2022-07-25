import { observable } from "@dependable/state";
import { isEqual } from "./isEqual.js";

export const route = observable(null);
export const location = observable(null, { isEqual });
export const params = observable(null, { isEqual });
export const queryParams = observable(null, { isEqual });
