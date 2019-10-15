import { assert } from 'chai';
import Example from '../../dist/src/example';

describe("Example", () => {
    it("Example Method", () => {
        const example = new Example();
        assert.strictEqual(example.myMethod(), 5);
    });
});
