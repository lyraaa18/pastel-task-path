import { describe, it, expect } from "vitest";
import { uid } from "./store";

describe("uid", () => {
  it("generates random IDs", () => {
    const id1 = uid();
    const id2 = uid();
    expect(id1).not.toBe(id2);
  });

  it("is a valid UUID format", () => {
    const id = uid();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });
});
