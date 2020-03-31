import * as utils from "../src/utils";

describe("utils", () => {
  it("arr helpers", () => {
    expect(utils.first([0, 1, 2, 3, 4])).toEqual(0);
    expect(utils.last([0, 1, 2, 3, 4])).toEqual(4);
    expect(utils.allButFist([0, 1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(utils.allButLast([0, 1, 2, 3, 4])).toEqual([0, 1, 2, 3]);
  });
});
