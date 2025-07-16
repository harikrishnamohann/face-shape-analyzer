import express from "express";
import multer from "multer";

const shapeAnalysisRouter = express.Router();
const upload = multer({ dest: "uploads/" });

function processImage(request, response) {
  const image = request.file;
  response.json("oval");
}

function processMeasurements(request, response) {
  const facialData = {
    height: parseFloat(request.body.height),
    jawline: parseFloat(request.body.jawline),
    cheekbone: parseFloat(request.body.cheekbone),
    forehead: parseFloat(request.body.forehead),
  };

  console.log("Processed facial data:", facialData);
  response.json("diamond");
}

shapeAnalysisRouter.route("/processImage").post(upload.single("image"), processImage);
shapeAnalysisRouter.route("/processMeasurements").post(upload.none(), processMeasurements);

export default shapeAnalysisRouter;
