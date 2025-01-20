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
import { User } from "../data/types";

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
    expect(response.body).toEqual({ msg: "hello" });
  });
});

describe("GET: /api/:language", () => {
  test("200: Repsonds with an array of french words", async () => {
    const response = await request(app).get("/api/french").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  test("404: Responds with an appropriate status and error message when given a valid but non-existent id", async () => {
    const response = await request(app).get("/api/portugese").expect(404);
    expect(response.body.msg).toBe("data not found");
  });
  test("404: Responce with an error message when input is unvalide type", async () => {
    const responce = await request(app).get("/api/5973").expect(404);
    expect(responce.body.msg).toBe("data not found");
  });
});

describe("GET: /api/users", () => {
  test("200: Repsonds with an array of users", async () => {
    const response = await request(app).get("/api/users").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  test("404: Responds with an appropriate status and error message when given a valid but non-existent id", async () => {
    const response = await request(app).get("/api/user").expect(404);
    expect(response.body.msg).toBe("data not found");
  });
});

describe("User Type Test", () => {
  test("should have correct structure", () => {
    const validUserBody: User = {
      username: "testuser",
      password: "securepassword",
      realName: "Test User",
      progress: [{ french: true }],
    };
    expect(typeof validUserBody.username).toBe("string");
    expect(typeof validUserBody.password).toBe("string");
    expect(validUserBody.progress).toBeInstanceOf(Array);
    expect(validUserBody.progress![0]).toHaveProperty("french", true);
  });
  test("The test should fail if structure is incorrect", () => {
    function isValidUserBody(user: any): user is User {
      return (
        typeof user.username === "string" &&
        typeof user.password === "string" &&
        (user.realName === undefined || typeof user.realName === "string") &&
        Array.isArray(user.progress) &&
        user.progress.every(
          (lang: any) =>
            typeof lang === "object" &&
            lang !== null &&
            Object.values(lang).every((val) => typeof val === "boolean")
        )
      );
    }
    const invalidUser = {
      username: "testuser",
      password: "securepassword",
      realName: "Test User",
      progress: [["french"]],
    };

    expect(isValidUserBody(invalidUser)).toBe(false);
  });
});

describe("GET: /api/users/:username", () => {
  test("200: Repsonds with a user object", async () => {
    const response = await request(app).get("/api/users/pezdav").expect(200);
    expect(response.body.username).toBe("pezdav");
  });
  test("200: Repsonds with a user object with updated progress", async () => {
    const response = await request(app).patch("/api/users/pezdav").send({ language: 'italian' }).expect(200);
    expect(response.body.progress).toEqual([
      { french: false },
      { german: false },
      { italian: true },
      { spanish: false },
      { ukrainian: false },
    ]);
  });
  test("404: Responds with an appropriate status and error message when given a valid but non-existent id", async () => {
    const response = await request(app)
      .get("/api/users/not-a-user")
      .expect(404);
    expect(response.body.msg).toBe("no user found");
  });
});

describe("POST: /api/users", () => {
  test("201: Repsonds with a user object", async () => {
    const newUser = {
      username: "pezdlove",
      realName: "peter",
      password: "dog123",
      progress: [
        { french: false },
        { german: false },
        { italian: false },
        { spanish: false },
        { ukrainian: false },
      ],
    };

    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201);
    expect(response.body.username).toBe("pezdlove");
  });
  test("400: Responds with an appropriate status and error message when user is not posted correctly", async () => {
    const newUser = {
      username: "pezdav",
    };
    const response = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400);
    expect(response.body.msg).toBe("Username and password are required");
  });
  test("400: Responds with an appropriate status and error when user alredy exist in database", async () => {
    const newUser = {
      username: "pezdav",
      password: "dog123",
    };

    const responce = await request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400);
    expect(responce.body.msg).toBe("User alredy exist in databse");
  });
});

describe("Get an message when the URL path is wrong ", () => {
  test("200: Repsonds with a user object", async () => {
    const response = await request(app).get("/Not-url").expect(404);
    expect(response.body.msg).toBe("The wrong URL path");
  });
});
