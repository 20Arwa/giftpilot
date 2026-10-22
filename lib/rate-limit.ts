const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const requestsByIp = new Map<string, number[]>();

export function checkRecommendationLimit(ip: string, now = Date.now()) {
  const active = (requestsByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (active.length >= MAX_REQUESTS) {
    requestsByIp.set(ip, active);
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((WINDOW_MS - (now - active[0])) / 1000)) };
  }
  active.push(now);
  requestsByIp.set(ip, active);
  if (requestsByIp.size > 1000) {
    for (const [key, stamps] of requestsByIp) {
      if (!stamps.some((stamp) => now - stamp < WINDOW_MS)) requestsByIp.delete(key);
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
