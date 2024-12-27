import { createClient } from 'redis';

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
})();

export default redisClient;
