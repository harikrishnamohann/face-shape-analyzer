// usage: node update_db.js [stylesheet|hairstyles]
// or just node update_db.js to update both collections

import fs from "fs";
import { exec } from "child_process";
import * as database from "./connect.js";

await database.connectToDb();
const db = database.getDb();

async function writeToDb(data, collectionName) {
  try {
    await db.collection(collectionName).deleteMany({});
    await db.collection(collectionName).insertMany(data);
  } catch (error) {
    console.error(error);
    process.exit(1);
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

// this function will fetch the image ids from hairstyles collection
// and replace the image names in the stylesheet with the corresponding ids
// it's like a foreign key relationship between hairstyles and stylesheet collections
async function fetchImageIdsFromImagesCollectionAsync(images) {
  for (let i = 0; i < images.length; i++) {
    const obj = await db.collection("hairstyles").findOne(
      { name: images[i] },
      { projection: { _id: 1 } }
    );
    if (obj) {
      images[i] = obj._id;
    } else {
      throw new Error(`Update hairstyles collection first, image ${images[i]} not found.`);
    }
  }
}

async function generateStylesheetJsonAsync() {
  await generateJsonAsync("stylesheet.json");
  const StyleSheet = JSON.parse(fs.readFileSync("./stylesheet.json", "utf-8"));
  console.log("writing stylesheet collection to db...");
  for (let i = 0; i < StyleSheet.length; i++) {
    await fetchImageIdsFromImagesCollectionAsync(StyleSheet[i].hairstyles)
    console.log(`fetched image ids for stylesheet ${i + 1}/${StyleSheet.length}`);
  }
  return StyleSheet;
}

async function generateHairstylesJsonAsync() {
  await generateJsonAsync("hairstyles.json");
  console.log("writing hairstyles collection to db...");
  return JSON.parse(fs.readFileSync("./hairstyles.json", "utf-8"));
}

if (process.argv.length === 3 && process.argv.includes("stylesheet")) {
  await writeToDb(await generateStylesheetJsonAsync(), "stylesheet");
} else if (process.argv.length === 3 && process.argv.includes("hairstyles")) {
  await writeToDb(await generateHairstylesJsonAsync(), "hairstyles");
} else {
  await writeToDb(await generateHairstylesJsonAsync(), "hairstyles");
  await writeToDb(await generateStylesheetJsonAsync(), "stylesheet");
}

console.log("Database update complete.");
await database.closeDb();