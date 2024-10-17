const rateLimitMap = new Map<string, number>();

const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 60 * 1000,
  maxRequests: 60,
};

export const rateLimit = (ip: string) => {
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    rateLimitMap.set(ip, 0);
  }
  const currentRequestCount = rateLimitMap.get(ip) || 0;
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  rateLimitMap.set(ip, currentRequestCount + 1);
  return false;
};
