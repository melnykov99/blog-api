import {MongoClient} from "mongodb";
import 'dotenv/config';

const mongoUri = process.env.MONGOURI!;

const client = new MongoClient(mongoUri)

async function runDb() {
    try {
        await client.connect();
        console.log('Connected successfully to mongo server')
    } catch (error) {
        console.log(error)
        await client.close()
    }
}
export {runDb, client}