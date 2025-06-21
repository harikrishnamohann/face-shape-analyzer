import fs from "fs";
import { exec } from "child_process";
import { promisify }  from "util";
import { connectToDb, getDb, closeDb } from "./connect.js";

await connectToDb();
const db = getDb();

async function WriteToDb(data, collectionName) {
  try {
    const collection = db.collection(collectionName);
    await collection.insertMany(data);
  } catch (error) {
    console.error(error);
  }
}

const execAsync = promisify(exec);
try {
    await execAsync("./generate_json_for_db.lua")
} catch (err) {
    console.error("lua script execution failed:", err);
    process.exit(1);
}

let StyleSheet, hairstyles;
try {
  StyleSheet = JSON.parse(fs.readFileSync("./stylesheet.json", "utf-8"));
  hairstyles = JSON.parse(fs.readFileSync("./hairstyles.json", "utf-8"));
} catch (err) {
  console.error("Failed to parse JSON:", err);
  process.exit(1);
}

console.log("writing style-sheet collection to db...");
await WriteToDb(StyleSheet, "style-sheet")
console.log("writing hairstyles collection to db...");
await WriteToDb(hairstyles, "hairstyles")

await closeDb();