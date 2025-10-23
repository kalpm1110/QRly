import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/lib/redis";
export const scanRateLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(6,"1 m"),
    analytics:true,
})
export const createQrRateLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.fixedWindow(100,'1 h'),
    analytics:true,
});