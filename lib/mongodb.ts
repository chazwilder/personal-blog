import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: Promise<typeof mongoose> | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: true,
      autoIndex: process.env.NODE_ENV !== "production",
    };

    // @ts-ignore
    cached!.promise = mongoose.connect(process.env.DATABASE_URL!, opts);
  }

  try {
    // @ts-ignore
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
