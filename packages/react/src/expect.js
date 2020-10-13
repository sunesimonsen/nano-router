import unexpected from "unexpected";
import unexpectedReaction from "unexpected-reaction";
import unexpectedDom from "unexpected-dom";
export { act, mount, unmount, simulate } from "unexpected-reaction";

const expect = unexpected.clone().use(unexpectedDom).use(unexpectedReaction);

export default expect;
