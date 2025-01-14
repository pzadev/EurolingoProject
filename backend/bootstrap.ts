import {
    testFrenchWords,
    testGermanWords,
    testItalianWords,
    testSpanishWords,
    testUrkainianWords,
    users,
  } from "./data/testData/index";
  import { seeding } from "./database/seeding";

  import app from './app'
  
  const port: number = 8080;
  
const bootstrap = async () => {
    // await seeding( italianWords, frenchWords, germanWords, spanishWords, urkainianWords )
    await seeding(
      testFrenchWords,
      testGermanWords,
      testItalianWords,
      testSpanishWords,
      testUrkainianWords,
      users
    );
 
    app.listen(port, () => {
      console.log("listening on port 8080");
    });
  };
  
  bootstrap();
  