import {createDatabase}  from '../database/db';
import { Db } from 'mongodb';
import app from '../../backend/app';
import request from 'supertest';
import { 
  testFrenchWords, 
  testGermanWords, 
  testItalianWords, 
  testSpanishWords, 
  testUrkainianWords, 
  users 
} from '../../backend/data/testData';
import { seeding } from '../database/seeding';


describe("GET: /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", async () => {
      const response = await request(app).get("/api").expect(200);
  
    //   await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
  
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
  })

