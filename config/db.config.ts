import dns from "node:dns"

dns.setServers(["8.8.8.8", "1.1.1.1"])

import mongoose from "mongoose"
import { ENV } from "./env.config"

const MONGODB_URI = ENV.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined")
}

const globalForMongoose = globalThis as unknown as {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = {
    conn: null,
    promise: null,
  }
}

export const connectDB = async () => {
  if (globalForMongoose.mongoose.conn) {
    return globalForMongoose.mongoose.conn
  }

  if (!globalForMongoose.mongoose.promise) {
    globalForMongoose.mongoose.promise = mongoose.connect(MONGODB_URI)
  }

  globalForMongoose.mongoose.conn = await globalForMongoose.mongoose.promise

  console.log("MongoDB Connected")

  return globalForMongoose.mongoose.conn
}
