import * as utils from "../src/utils";

describe("utils", () => {
  it("arr helpers", () => {
    expect(utils.first([0, 1, 2, 3, 4])).toEqual(0);
    expect(utils.last([0, 1, 2, 3, 4])).toEqual(4);
    expect(utils.allButFist([0, 1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(utils.allButLast([0, 1, 2, 3, 4])).toEqual([0, 1, 2, 3]);
  });

  it("iterator helpers", () => {
    function* yieldNTimes(n: number): Generator<number> {
      for (let i = 0; i < n; i++) {
        yield i;
      }
    }

    expect(utils.takeAll(yieldNTimes(0))).toEqual([]);
    expect(utils.takeAll(yieldNTimes(1))).toEqual([0]);
    expect(utils.takeAll(yieldNTimes(2))).toEqual([0, 1]);

    expect(utils.isEmptyIterable(yieldNTimes(0))).toEqual(true);
    expect(utils.isEmptyIterable(yieldNTimes(1))).toEqual(false);
    expect(utils.isEmptyIterable(yieldNTimes(2))).toEqual(false);
  });
});
