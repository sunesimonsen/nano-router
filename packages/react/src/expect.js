import unexpected from "unexpected";
import unexpectedDom from "unexpected-dom";
export { act, mount, unmount, simulate } from "react-dom-testing";

const expect = unexpected.clone().use(unexpectedDom);

export default expect;
