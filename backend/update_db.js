// usage: node update_db.js [stylesheet|hairstyles]
// or just node update_db.js to update both collections

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

async function generate_json(file_name = "") {
  try {
    const execAsync = promisify(exec);
    await execAsync(`./generate_json_for_db.lua ${file_name}`)
  } catch (err) {
    console.error("lua script execution failed:", err);
    process.exit(1);
  }
}

if (process.argv.length === 3 && process.argv.includes("stylesheet")) {
  await generate_json("stylesheet.json");
  const StyleSheet = JSON.parse(fs.readFileSync("./stylesheet.json", "utf-8"));
  console.log("writing stylesheet collection to db...");
  await WriteToDb(StyleSheet, "stylesheet")
} else if (process.argv.length === 3 && process.argv.includes("hairstyles")) {
  await generate_json("hairstyles.json");
  const hairstyles = JSON.parse(fs.readFileSync("./hairstyles.json", "utf-8"));
  console.log("writing hairstyles collection to db...");
  await WriteToDb(hairstyles, "hairstyles")
} else {
  await generate_json();
  const StyleSheet = JSON.parse(fs.readFileSync("./stylesheet.json", "utf-8"));
  const hairstyles = JSON.parse(fs.readFileSync("./hairstyles.json", "utf-8"));
  console.log("writing stylesheet collection to db...");
  await WriteToDb(StyleSheet, "stylesheet")
  console.log("writing hairstyles collection to db...");
  await WriteToDb(hairstyles, "hairstyles")
}

await closeDb();