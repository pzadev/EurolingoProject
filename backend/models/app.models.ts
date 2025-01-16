import { MongoClient, Db, Collection } from "mongodb";
import { initializeConnection, getDb } from "../database/connect";
import { MONGODB_URI, DATABASE_NAME } from "../database/config";

export const fetchAllWord = async (language: string): Promise<any> => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection = db.collection(language);
    const words = await collection.find({}).toArray();
    if (words.length === 0) {
      throw { status: 404, msg: "data not found" };
    }
    return words;
  } catch (err) {
    throw err;
  }
};

export const fetchAllUsers = async (): Promise<any> => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection = db.collection("users");
    const users = await collection.find({}).toArray();
    if (users.length <= 0) {
      throw { status: 404, msg: "no users found" };
    }
    return users;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchUserByUsername = async (userParam: string): Promise<any> => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection = db.collection("users");
    const user = await collection.findOne({ username: userParam });
    console.log(userParam, "<--userparams");
    if (!user) {
      throw { status: 404, msg: "no user found" };
    }
    return user;
  } catch (err) {
    console.log(err, "<-- err in model");
    throw err;
  }
};

export const postUser = async (body: object): Promise<any> => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection = db.collection("users");
    const result = await collection.insertOne(body);
    const newUser = await collection.findOne({ _id: result.insertedId });
    if (!newUser) {
      throw { status: 404, msg: "user not posted" };
    }
    return newUser;
  } catch (err) {
    console.log(err);
  }
};
