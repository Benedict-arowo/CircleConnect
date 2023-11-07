"use strict";
const sum = (x, y) => {
    console.log(x, y);
    return x + y;
};
describe("Authentication tests", () => {
    test("adds 1 + 2 to equal 3", () => {
        expect(sum(1, 2)).toBe(3);
    });
});
