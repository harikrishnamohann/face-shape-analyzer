const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const fs = require("fs");

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
    const data = await collection.find({shape: "oval"}).toArray();
    console.log(data[0].hairstyles[0].images[0]);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

StyleSheet = JSON.parse(fs.readFileSync("./stylesheet.json", "utf-8"))
hairstyles = JSON.parse(fs.readFileSync("./hairstyles.json", "utf-8"));

WriteToDb(StyleSheet, "style-sheet")
WriteToDb(hairstyles, "hairstyles")