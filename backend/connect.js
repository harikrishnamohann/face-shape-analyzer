import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const Client = new MongoClient(process.env.ATLAS_URI);
let DataBase; 


export async function connectToDb() {
  DataBase = Client.db("hair-style-analyzer");
}

export function getDb() {
  return DataBase;
}

export async function closeDb() {
    await Client.close();
}
