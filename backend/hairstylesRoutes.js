import express from "express";
import * as database from "./connect.js";
import objectId from "mongodb";

let hairstylesRouter = express.Router();

hairstylesRouter.route("/image/:id").get(async (request, response) => {
    const db= database.getDb();
    let imageData = await db.collection("hairstyles").findOne({ _id: new objectId(request.params.id) });
    if (Object.keys(imageData).length > 0) {
        response.json(imageData);
    } else {
        throw new Error("Image was not found.");
    }
});

export default hairstylesRouter;