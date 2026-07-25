const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Checks if a request from a given IP is allowed under the rate limit.
 *
 * @param ip The client's IP address
 * @param limit The maximum number of allowed requests in the window
 * @param windowMs The duration of the sliding window in milliseconds
 * @returns boolean true if the request is allowed, false if it is rate-limited
 */
export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clears the rate limit map. Useful for running tests.
 */
export function clearRateLimits(): void {
  rateLimitMap.clear();
}
