import express from "express";
import * as database from "../connect.js";
import { ObjectId } from "mongodb";

// errors should be handled later

let hairstylesRouter = express.Router();

async function updateOne(request, response) {
  const db = database.getDb();
  const { id } = request.params;
  if (!ObjectId.isValid(id)) {
    return response.status(400).json({ error: "invalid object id" });
  }

  let mongoObj = {
    $set: {
      name: request.body.name,
      images: request.body.images,
    },
  };
  let data = await db
    .collection("hairstyles")
    .updateOne({ _id: new ObjectId(String(id)) }, mongoObj);
  if (data.matchedCount === 0) {
    throw new Error(`Hairstyle "${request.params.id}" doesn't exist. create it first.`);
  }
  response.json(data);
}

async function createOne(request, response) {
  const db = database.getDb();
  const newHairstyle = {
    name: request.body.name,
    images: request.body.images,
  };
  let data = await db.collection("hairstyles").insertOne(newHairstyle);
  response.json(data);
}

async function retrieveOne(request, response) {
  const db = database.getDb();
  const { id } = request.params;
  if (!ObjectId.isValid(id)) {
    return response.status(400).json({ error: "invalid object id" });
  }

  let hairstyle = await db.collection("hairstyles").findOne({ _id: new ObjectId(String(id)) });
  if (hairstyle && Object.keys(hairstyle).length > 0) {
    response.json(hairstyle);
  } else {
    throw new Error(`Hairstyle ${request.params.id} not found.`);
  }
}

async function deleteOne(request, response) {
  const db = database.getDb();
  const { id } = request.params;
  if (!ObjectId.isValid(id)) {
    return response.status(400).json({ error: "invalid object id" });
  }

  let data = await db.collection("hairstyles").deleteOne({ _id: new ObjectId(String(id)) });
  if (data.deletedCount === 0) {
    throw new Error(`Hairstyle ${request.params.id} not found.`);
  }
  response.json(data);
}

hairstylesRouter.route("/hairstyles").post(createOne);
hairstylesRouter.route("/hairstyles/:id").put(updateOne);
hairstylesRouter.route("/hairstyles/:id").get(retrieveOne);
hairstylesRouter.route("/hairstyles/:id").delete(deleteOne);

export default hairstylesRouter;
