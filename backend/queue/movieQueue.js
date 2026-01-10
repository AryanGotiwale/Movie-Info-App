import { Queue } from "bullmq";
import dotenv from "dotenv";
import IORedis from "ioredis";

dotenv.config();

console.log("🔍 movieQueue.js loaded");
console.log("REDIS_HOST:", process.env.REDIS_HOST);
console.log("REDIS_PORT:", process.env.REDIS_PORT);
console.log("REDIS_URL:", process.env.REDIS_URL);

// Create Redis connection - ABSOLUTELY NO TLS
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  // Explicitly set these to prevent any TLS
  tls: undefined,
  enableTLSForSentinelMode: false,
});

connection.on('connect', () => {
  console.log('✅ movieQueue Redis connected');
});

connection.on('ready', () => {
  console.log('✅ movieQueue Redis ready');
});

connection.on('error', (err) => {
  console.error('❌ movieQueue Redis error:', err.message);
  console.error('Error code:', err.code);
});

export const movieQueue = new Queue("movieQueue", {
  connection: connection,
});

console.log("✅ movieQueue exported");