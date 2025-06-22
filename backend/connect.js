import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const Client = new MongoClient(process.env.ATLAS_URI);
let DataBase; 


export async function connectToDb() {
  DataBase = Client.db(process.env.DB_NAME);
}

export function getDb() {
  return DataBase;
}

export async function closeDb() {
    await Client.close();
}
