import { createClient } from "redis";

const redis = createClient({
    url: process.env.REDIS_URL || process.env.REDIS_URL_DOCKER,
    disableOfflineQueue: true
})

redis.on("error" , (err) => console.log("Redis client error" , err.message));

redis.connect().catch((err) => console.log("Redis connection failed" , err.message));

export default redis;