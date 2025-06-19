const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const fs = require("fs");

async function WriteToDb({ data }) {
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);

  try {
    await client.connect();
    const db = client.db("hair-style-analyzer");
    const collection = db.collection("style-sheet");
    collection.insertMany(data);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

StyleSheet: [
 {
  shape: ,
  description: ,
  hairstyles: [
    {
      name: ,
      description: ,
      images: [

      ],
    },
  ]
 },

];
