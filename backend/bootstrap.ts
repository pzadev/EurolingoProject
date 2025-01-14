import {
  testFrenchWords,
  testGermanWords,
  testItalianWords,
  testSpanishWords,
  testUrkainianWords,
  users,
} from "./data/testData/index";
import { seeding } from "./database/seeding";

import app from "./app";
import { MongoClient } from "mongodb";

const port: number = 8080;

let dbClient: MongoClient;
const bootstrap = async () => {
  // await seeding( italianWords, frenchWords, germanWords, spanishWords, urkainianWords )
  const { db, client } = await seeding(
    testFrenchWords,
    testGermanWords,
    testItalianWords,
    testSpanishWords,
    testUrkainianWords,
    users
  );
  dbClient = client;

  return app.listen(port, () => {
    console.log("listening on port 8080");
  });
};

bootstrap().then((server) => {
  process.on("SIGTERM", () => {
    server.close();
    dbClient.close();
  });
});
