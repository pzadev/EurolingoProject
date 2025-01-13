import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";

const dbName: string = "EuroLingo";

export async function createDatabase(): Promise<Db> {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    return client.db(dbName);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
