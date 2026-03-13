import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export async function connectToDatabase() {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);

    await client.connect();

    console.log("Succesfully connected to MongoDB Atlas");

    return client;
}