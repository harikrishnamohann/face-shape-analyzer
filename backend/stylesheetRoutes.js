import express from "express";
import * as database from "./connect.js";
import { ObjectId } from "mongodb";

let stylesheetRouter = express.Router();

stylesheetRouter.route("/shapes/:id").get(async (request, response) => {
    const db = database.getDb(); 
    let shapeData = await db.collection("stylesheet").findOne({ _id: new ObjectId(request.params.id) });
    if (Object.keys(shapeData).length > 0) {
        response.json(shapeData);
    } else {
        throw new Error("Data was not found.");
    }
});

export default stylesheetRouter;