// import { createDatabase } from "../database/db";
// import { Db, MongoClient } from "mongodb";
// import app from "../../backend/app";
// import request from "supertest";
// import {
//   testFrenchWords,
//   testGermanWords,
//   testItalianWords,
//   testSpanishWords,
//   testUrkainianWords,
//   users,
// } from "../../backend/data/testData";
// import { seeding } from "../database/seeding";

// let testdb: Db;
// let testCLient: MongoClient;

// beforeAll(async () => {
//   const { db, client } = await seeding(
//     testFrenchWords,
//     testGermanWords,
//     testItalianWords,
//     testSpanishWords,
//     testUrkainianWords,
//     users
//   );
//   testdb = db;
//   testCLient = client;
// });

// afterAll(async () => {
//   console.log("Dropping database...");
//   await testdb.dropDatabase();
//   console.log("Closing client...");
//   await testCLient.close();
//   console.log("Test completed");
// });

// describe("check data we connecting", () => {
//   test("should connect to the test database", async () => {
//     expect(testdb.databaseName).toBe("EuroLingoTest");
//   });
// });

// describe("GET: /api", () => {
//   test("200: Responds with an object detailing the documentation for each endpoint", async () => {
//     const response = await request(app).get("/api").expect(200);

//     //await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

//     expect(response.body).toEqual({ msg: "hello" });
//   });
// });

// describe("GET: /api/:language", () => {
//   test("200: Repsonds with an array of french words", async () => {
//     const response = await request(app).get("/api/french").expect(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });
// });

// describe("GET: /api/users", () => {
//   test("200: Repsonds with an array of users", async () => {
//     const response = await request(app).get("/api/users").expect(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });
// });

// describe("GET: /api/users/:username", () => {
//   test("200: Repsonds with a user object", async () => {
//     const response = await request(app).get("/api/users/pezdav").expect(200);
//     expect(response.body.username).toBe("pezdav");
//   });
// });

import { initializeConnection, closeConnection } from "../database/connect";
import { MONGODB_URI, DATABASE_NAME } from "../database/config";
import { Db } from "mongodb";
import request from "supertest";
import app from "../app";
import { seeding } from "../database/seed";
import {
  testFrenchWords,
  testGermanWords,
  testItalianWords,
  testSpanishWords,
  testUrkainianWords,
  users,
} from "../../backend/data/testData";

let testDb: Db;

beforeAll(async () => {
  const { db } = await initializeConnection(MONGODB_URI, DATABASE_NAME);
  if (!db) {
    throw new Error("Failed to initialize the database");
  }
  testDb = db;

  await seeding(
    testFrenchWords,
    testGermanWords,
    testItalianWords,
    testSpanishWords,
    testUrkainianWords,
    users
  );
});

afterAll(async () => {
  await closeConnection();
});

describe("Database Connection Tests", () => {
  test("should connect to the test database", async () => {
    expect(testDb.databaseName).toBe(DATABASE_NAME);
  });

  test("should retrieve collections", async () => {
    const collections = await testDb.listCollections().toArray();
    expect(Array.isArray(collections)).toBe(true);
  });
});

describe("GET: /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", async () => {
    const response = await request(app).get("/api").expect(200);

    //await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

    expect(response.body).toEqual({ msg: "hello" });
  });
});

describe("GET: /api/:language", () => {
  test("200: Repsonds with an array of french words", async () => {
    const response = await request(app).get("/api/french").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("GET: /api/users", () => {
  test("200: Repsonds with an array of users", async () => {
    const response = await request(app).get("/api/users").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("GET: /api/users/:username", () => {
  test("200: Repsonds with a user object", async () => {
    const response = await request(app).get("/api/users/pezdav").expect(200);
    expect(response.body.username).toBe("pezdav");
  });
});
