import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "test" ? ".env.local" : ".env.development";
dotenv.config({ path: envFile });

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017";
export const DATABASE_NAME = process.env.DATABASE_NAME || "defaultDB";
