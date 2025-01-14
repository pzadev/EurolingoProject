import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "test" ? ".env.local" : ".env.development";
dotenv.config({ path: envFile });
const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName: string = process.env.DATABASE_NAME || "defaultDB";

export async function createDatabase(): Promise<{
  db: Db;
  client: MongoClient;
}> {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    return { db, client };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
