import { MongoClient, Db } from "mongodb";

const uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017'

const dbName: string = 'EuroLingo'

export async function createDatabase (): Promise<Db> {
    const client = new MongoClient(uri)
    try {
        await client.connect()
        return client.db(dbName)
    }
    catch(err) {
        console.log(err)
    }
}






