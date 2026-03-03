import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("returns the combined class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
      expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
      expect(cn("foo", "bar", "baz", "qux")).toBe("foo bar baz qux");
    });
  });
});
