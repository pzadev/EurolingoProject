import { MongoClient} from "mongodb";

const uri =
  "mongodb+srv://peterzaustin:ZRNHIgjITfwbGlLM@eurolingo.3walr.mongodb.net/?retryWrites=true&w=majority&appName=EuroLingo";

const client = new MongoClient(uri);

export const userCheck = async (username) => {
  try {
    await client.connect();
    const database = client.db("EuroLingoTest");
    const users = database.collection("users");

    const user = await users.findOne({ username });
    return user;
  } catch (error) {
    console.error("Error occured connecting to MongoDB", error);
  } finally {
    await client.close();
  }
};
