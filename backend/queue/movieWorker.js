import { Worker } from "bullmq";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "../models/movieModel.js";
import IORedis from "ioredis";

dotenv.config();

// DEBUG - Print everything
console.log("========== DEBUG INFO ==========");
console.log("REDIS_HOST:", process.env.REDIS_HOST);
console.log("REDIS_PORT:", process.env.REDIS_PORT);
console.log("REDIS_URL:", process.env.REDIS_URL);
console.log("Has password:", !!process.env.REDIS_PASSWORD);
console.log("================================");

await mongoose.connect(process.env.MONGO_URI);
console.log("🎬 Worker connected to MongoDB");

// Create Redis connection explicitly - FORCE no TLS
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true, // Don't connect automatically
});

// Try to connect manually
try {
  await connection.connect();
  console.log('✅ Worker Redis connected successfully');
} catch (err) {
  console.error('❌ Worker Redis connection failed:', err.message);
  process.exit(1);
}

const worker = new Worker(
  "movieQueue",
  async (job) => {
    console.log("✅ Processing job:", job.data);
    await Movie.create(job.data);
  },
  {
    connection: connection,
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

console.log("🎬 Movie Worker started");