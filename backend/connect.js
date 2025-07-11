import { MongoClient } from "mongodb";

// database key is stored in ./.env file
import dotenv from "dotenv";
dotenv.config();

let Client, DataBase;

try {
  Client = new MongoClient(process.env.ATLAS_URI);
} catch (error) {
  console.error("Failed to create MongoClient:", error);
  throw error;
}

export async function connectToDb() {
  DataBase = Client.db(process.env.DB_NAME);
}

export function getDb() {
  return DataBase;
}

export async function closeDb() {
  await Client.close();
}
