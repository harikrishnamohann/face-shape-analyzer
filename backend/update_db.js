import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import fs from "fs";
import { exec } from "child_process";
import { promisify }  from "util";

dotenv.config({ path: "./config.env" });

async function WriteToDb(data, collectionName) {
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);

  try {
    await client.connect();
    const db = client.db("hair-style-analyzer");
    const collection = db.collection(collectionName);
    await collection.insertMany(data);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

async function ReadFromDb() {
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);

  try {
    await client.connect();
    const db = client.db("hair-style-analyzer");
    const collection = db.collection("style-sheet");
    const data = await collection.find({ shape: "oval" }).toArray();
    console.log(data[0].hairstyles[0].images[0]);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

const execAsync = promisify(exec);
try {
  await execAsync("./generate_json_for_db.lua")
} catch (err) {
  console.error("lua script execution failed:", err);
  process.exit(1);
}

const StyleSheet = JSON.parse(fs.readFileSync("./stylesheet.json", "utf-8"));
const hairstyles = JSON.parse(fs.readFileSync("./hairstyles.json", "utf-8"));

// await WriteToDb(StyleSheet, "style-sheet")
// await WriteToDb(hairstyles, "hairstyles")
