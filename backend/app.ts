import express, { Application } from "express";
import apiRouter from "./routers";
import {
  italianWords,
  frenchWords,
  germanWords,
  spanishWords,
  urkainianWords,
} from "./data/devData/index";
// import {
//   testFrenchWords,
//   testGermanWords,
//   testItalianWords,
//   testSpanishWords,
//   testUrkainianWords,
//   users,
// } from "./data/testData/index";
// import { seeding } from "./database/seeding";

const app: Application = express();
app.use(express.json());
// const port: number = 8080;

app.use("/api", apiRouter);

// const bootstrap = async () => {
//   // await seeding( italianWords, frenchWords, germanWords, spanishWords, urkainianWords )
//   await seeding(
//     testFrenchWords,
//     testGermanWords,
//     testItalianWords,
//     testSpanishWords,
//     testUrkainianWords,
//     users
//   );

//   app.listen(port, () => {
//     console.log("listening on port 8080");
//   });
// };

// bootstrap();


export default app