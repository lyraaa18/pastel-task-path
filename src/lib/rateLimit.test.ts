import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, clearRateLimits } from "./rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    clearRateLimits();
  });

  it("allows requests under the limit", () => {
    const ip = "1.2.3.4";
    // Limit: 3 requests per 10 seconds
    expect(rateLimit(ip, 3, 10000)).toBe(true);
    expect(rateLimit(ip, 3, 10000)).toBe(true);
    expect(rateLimit(ip, 3, 10000)).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const ip = "1.2.3.4";
    // Limit: 2 requests
    expect(rateLimit(ip, 2, 10000)).toBe(true);
    expect(rateLimit(ip, 2, 10000)).toBe(true);
    expect(rateLimit(ip, 2, 10000)).toBe(false);
  });

  it("resets limits after window passes", () => {
    const ip = "1.2.3.4";
    expect(rateLimit(ip, 1, -10)).toBe(true); // Window expired immediately because windowMs was negative
    expect(rateLimit(ip, 1, 10000)).toBe(true); // Reset triggers, should be allowed
  });

  it("handles different IPs independently", () => {
    const ip1 = "1.2.3.4";
    const ip2 = "5.6.7.8";
    expect(rateLimit(ip1, 1, 10000)).toBe(true);
    expect(rateLimit(ip1, 1, 10000)).toBe(false);
    expect(rateLimit(ip2, 1, 10000)).toBe(true);
  });
});
