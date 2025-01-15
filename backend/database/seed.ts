import { getDb } from "./connect";

export async function seeding(
  italianWords: any,
  frenchWords: any,
  germanWords: any,
  spanishWords: any,
  ukrainianWords: any,
  usersData: any
): Promise<void> {
  try {
    const db = getDb();

    const collections = [
      { name: "ukrainian", data: ukrainianWords },
      { name: "french", data: frenchWords },
      { name: "german", data: germanWords },
      { name: "italian", data: italianWords },
      { name: "spanish", data: spanishWords },
    ];

    for (const { name, data } of collections) {
      const collection = db.collection(name);
      await collection.deleteMany({});
      console.log(`${name} collection cleared.`);
      await collection.insertMany(data);
      console.log(`${name} collection seeded with ${data.length} records.`);
    }

    const users = db.collection("users");
    await users.deleteMany({});
    console.log(`Users collection cleared.`);
    await users.insertMany(usersData);
    console.log(`Users collection seeded with ${usersData.length} records.`);
  } catch (err) {
    console.error("Seeding failed:", err);
    throw err;
  }
}
