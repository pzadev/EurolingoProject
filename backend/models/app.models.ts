import { Collection } from "mongodb";
import { initializeConnection, getDb } from "../database/connect";
import { MONGODB_URI, DATABASE_NAME } from "../database/config";
import { Language, User } from "../data/types";

export const fetchAllWord = async (language: string): Promise<Language[]> => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection<Language> = db.collection(language);
    const words = await collection.find({}).toArray();
    if (words.length === 0) {
      throw { status: 404, msg: "data not found" };
    }
    return words;
  } catch (err) {
    throw err;
  }
};

export const fetchAllUsers = async (): Promise<Language[]> => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection<Language> = db.collection("users");
    const users = await collection.find({}).toArray();
    if (users.length <= 0) {
      throw { status: 404, msg: "no users found" };
    }
    return users;
  } catch (err) {
    throw err;
  }
};

export const fetchUserByUsername = async (
  userParam: string
): Promise<User[]> => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection<User[]> = db.collection("users");
    const user = await collection.findOne({ username: userParam });
    if (!user) {
      throw { status: 404, msg: "no user found" };
    }
    return user;
  } catch (err) {
    throw err;
  }
};

interface Progress {
  [key: string]: boolean;
}

export interface UserBody {
  username: string;
  password: string;
  realName?: string;
  progress?: Progress[];
}

export const postUser = async (body: UserBody): Promise<User> => {
  try {
    if (!body.username || !body.password) {
      throw { status: 400, msg: "Username and password are required" };
    }

    if (!body.realName) {
      body.realName = body.username;
    }

    if (!body.progress) {
      body.progress = [
        { french: false },
        { german: false },
        { italian: false },
        { spanish: false },
        { ukrainian: false },
      ];
    }

    const userToInsert: Omit<User, "_id"> = {
      username: body.username,
      password: body.password,
      realName: body.realName as string,
      progress: body.progress,
    };

    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection<User> = db.collection("users");
    const findExistUser = await collection.findOne({ username: body.username });
    if (findExistUser) {
      throw { status: 400, msg: "User alredy exist in databse" };
    }
    const result = await collection.insertOne(userToInsert);
    const newUser = await collection.findOne({ _id: result.insertedId });
    if (!newUser) {
      throw { status: 404, msg: "user not posted" };
    }
    return newUser;
  } catch (err) {
    throw err;
  }
};

export const updateUserProgress = async (
  username: string,
  language: string
): Promise<User> => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    const db = getDb();
    const collection: Collection<User> = db.collection("users");
    const result = await collection.updateOne(
      { username },
      { $set: { 
        [`progress.$[elem].${language}`]: true,
       } },
      {
        arrayFilters: [
          { "elem": { [language]: false } },
        ], 
        })

        if (result.matchedCount === 0) {
         throw { status: 404, msg: "User or language not found" };
        }

        const updatedUser = await collection.findOne({ username });
        if (!updatedUser) {
         throw { status: 404, msg: "User not found after update" };
         }
    return updatedUser
  } catch (err) {
    throw err
  }
}

