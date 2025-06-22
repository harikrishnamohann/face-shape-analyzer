// usage: node update_db.js [stylesheet|hairstyles]
// or just node update_db.js to update both collections

import fs from "fs";
import { exec } from "child_process";
import { promisify }  from "util";
import { connectToDb, getDb, closeDb } from "./connect.js";

await connectToDb();
const db = getDb();

async function writeToDb(data, collectionName) {
  try {
    const collection = db.collection(collectionName);
    await collection.insertMany(data);
  } catch (error) {
    console.error(error);
  }
}

function generateJsonAsync(file_name = "") {
  return new Promise((resolve, reject) => {
    exec(`./generate_json_for_db.lua ${file_name}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing Lua script:", error);
        process.exit(1);
      } else if (stderr) {
        console.error("Lua script stderr:", stderr);
        process.exit(1);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

if (process.argv.length === 3 && process.argv.includes("stylesheet")) {
  await generateJsonAsync("stylesheet.json");
  const StyleSheet = JSON.parse(fs.readFileSync("./stylesheet.json", "utf-8"));
  console.log("writing stylesheet collection to db...");
  await writeToDb(StyleSheet, "stylesheet")
} else if (process.argv.length === 3 && process.argv.includes("hairstyles")) {
  await generateJsonAsync("hairstyles.json");
  const hairstyles = JSON.parse(fs.readFileSync("./hairstyles.json", "utf-8"));
  console.log("writing hairstyles collection to db...");
  await writeToDb(hairstyles, "hairstyles")
} else {
  await generateJsonAsync();
  const StyleSheet = JSON.parse(fs.readFileSync("./stylesheet.json", "utf-8"));
  const hairstyles = JSON.parse(fs.readFileSync("./hairstyles.json", "utf-8"));
  console.log("writing stylesheet collection to db...");
  await writeToDb(StyleSheet, "stylesheet")
  console.log("writing hairstyles collection to db...");
  await writeToDb(hairstyles, "hairstyles")
}

await closeDb();