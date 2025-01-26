import dotenv from "dotenv";

<<<<<<< HEAD

=======
>>>>>>> 0ae082ce8c21cba09a334cebd31389b8ed08c838
const envFile =
  process.env.NODE_ENV === "test" ? ".env.local" : ".env.development";
dotenv.config({ path: envFile });

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017";
export const DATABASE_NAME = process.env.DATABASE_NAME || "defaultDB";
