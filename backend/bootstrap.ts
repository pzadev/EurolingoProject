import {
  testFrenchWords,
  testGermanWords,
  testItalianWords,
  testSpanishWords,
  testUrkainianWords,
  users,
} from "./data/testData/index";
import { seeding } from "./database/seed";
import { MongoClient } from "mongodb";
import { initializeConnection, getDb } from "./database/connect";
import { MONGODB_URI, DATABASE_NAME } from "./database/config";

import app from "./app";

const port: number = 8080;

const bootstrap = async () => {
  // await seeding( italianWords, frenchWords, germanWords, spanishWords, urkainianWords )
  await initializeConnection(MONGODB_URI, DATABASE_NAME);
  await seeding(
    testFrenchWords,
    testGermanWords,
    testItalianWords,
    testSpanishWords,
    testUrkainianWords,
    users
  );

  return app.listen(port, () => {
    console.log("listening on port 8080");
  });
};

bootstrap().catch((err) => {
  console.log(err);
});
