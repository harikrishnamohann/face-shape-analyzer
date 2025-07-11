import express from "express";
import * as database from "../connect.js";

/**
 * This file contains methods to perform CURD operations on
 * stylesheet collection. Routes:
 *
 * POST => /stylesheet          -- to create a shape entity
 * PUT => /stylesheet/:shape    -- to update a shape entity
 * GET => /stylesheet/:shape    -- to retrieve a shape entity
 * DELETE => /stylesheet/:shape -- to delete on shape entity
 */

let stylesheetRoutes = express.Router();

function isValidShape(shape) {
  return ["oval", "round", "square", "triangle", "diamond", "oblong"].includes(
    String(shape).toLowerCase()
  );
}

async function createOne(request, response) {
  let db = database.getDb();
  let mongoObj = {
    shape: request.body.shape,
    description: request.body.description,
    hairstyles: request.body.hairstyles,
  };

  let data = await db.collection("stylesheet").insertOne(mongoObj);
  response.json(data);
}
async function updateOne(request, response) {
  const db = database.getDb();
  const { shape } = request.params;
  if (!isValidShape(shape)) {
    throw new Error("invalid shape");
  }
  let mongoObj = {
    $set: {
      shape: request.body.shape,
      description: request.body.description,
      hairstyles: request.body.hairstyles,
    },
  };
  let data = await db.collection("stylesheet").updateOne({ shape: String(shape) }, mongoObj);
  if (data.matchedCount === 0) {
    throw new Error("Shape not found");
  }
  response.json(data);
}
async function retrieveOne(request, response) {
  const db = database.getDb();
  const { shape } = request.params;
  if (!isValidShape(shape)) {
    throw new Error("invalid shape");
  }
  let shapeData = await db.collection("stylesheet").findOne({ shape: String(shape) });
  if (shapeData && Object.keys(shapeData).length > 0) {
    response.json(shapeData);
  } else {
    throw new Error("Data was not found.");
  }
}
async function deleteOne(request, response) {
  const db = database.getDb();
  const { shape } = request.params;
  if (!isValidShape(shape)) {
    throw new Error("invalid shape");
  }
  let data = await db.collection("stylesheet").deleteOne({ shape: String(shape) });
  if (data.deletedCount === 0) {
    throw new Error("shape not found.");
  }
  response.json(data);
}

stylesheetRoutes.route("/stylesheet").post(createOne);
stylesheetRoutes.route("/stylesheet/:shape").put(updateOne);
stylesheetRoutes.route("/stylesheet/:shape").get(retrieveOne);
stylesheetRoutes.route("/stylesheet/:shape").delete(deleteOne);

export default stylesheetRoutes;
