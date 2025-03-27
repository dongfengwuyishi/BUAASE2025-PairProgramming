import assert from "assert";
import { add } from "../build/debug.js";
assert.strictEqual(add(1, 2), 5);
console.log("ok");
