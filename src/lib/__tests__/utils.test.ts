import { add } from "@/lib/utils";

describe("utils", () => {
  describe("add", () => {
    it("returns the sum of two numbers", () => {
      expect(add(1, 2)).toBe(3);
      expect(add(-1, 1)).toBe(0);
    });
  });
});
