import { Db, MongoClient } from "mongodb";
import { createDatabase } from "./db";

export async function seeding(
  italianWords: any,
  frenchWords: any,
  germanWords: any,
  spanishWords: any,
  urkainianWords: any,
  usersData: any
): Promise<{ db: Db; client: MongoClient }> {
  try {
    const createDataBase = await createDatabase();
    const db: Db = createDataBase.db;
    const client: MongoClient = createDataBase.client;

    const ukrainianCollection = db.collection("ukrainian");
    const frenchCollection = db.collection("french");
    const germanCollection = db.collection("german");
    const italianCollection = db.collection("italian");
    const spanishCollection = db.collection("spanish");
    const users = db.collection("users");

    const deleteUkrainain = await ukrainianCollection.deleteMany({});
    console.log(`${deleteUkrainain} deleted`);
    const deleteFrench = await frenchCollection.deleteMany({});
    console.log(`${deleteFrench} deleted`);
    const deleteGerman = await germanCollection.deleteMany({});
    console.log(`${deleteGerman} deleted`);
    const deleteItalian = await italianCollection.deleteMany({});
    console.log(`${deleteItalian} deleted`);
    const deleteSpanish = await spanishCollection.deleteMany({});
    console.log(`${deleteSpanish} deleted`);
    const deleteUsers = await users.deleteMany({});
    console.log(`${deleteUsers} deleted`);

    await ukrainianCollection.insertMany(urkainianWords);
    console.log(`${ukrainianCollection} insert ${urkainianWords.length} words`);
    await frenchCollection.insertMany(frenchWords);
    console.log(`${frenchCollection} insert ${frenchWords.length} words`);
    await germanCollection.insertMany(germanWords);
    console.log(`${germanCollection} insert ${germanWords.length} words`);
    await italianCollection.insertMany(italianWords);
    console.log(`${italianCollection} insert ${italianWords.length} words`);
    await spanishCollection.insertMany(spanishWords);
    console.log(`${spanishCollection} insert ${spanishWords.length} words`);
    await users.insertMany(usersData);
    console.log("Users insert");
    return { db, client };
  } catch (err) {
    console.log(err);
    throw err;
  }
}
