import app from "./app";
import { initializeConnection } from "./database/connect";
import { MONGODB_URI, DATABASE_NAME } from "./database/config";

const { PORT = 9090 } = process.env;

const startServer = async () => {
  try {
    await initializeConnection(MONGODB_URI, DATABASE_NAME);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
