import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let Client;

try {
  Client = new MongoClient(process.env.ATLAS_URI);
} catch (error) {
  console.error("Failed to create MongoClient:", error);
  throw error;
}

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
