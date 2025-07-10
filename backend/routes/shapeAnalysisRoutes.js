import express from "express";
import multer from "multer";

const shapeAnalysisRouter = express.Router();
const upload = multer({ dest: "uploads/" });

function processImage(request, response) {
  const facialData = {
    image: request.file,
    isMl: request.body.isMl === "true",
    jawline: parseFloat(request.body.jawline),
    height: parseFloat(request.body.height),
    cheekbone: parseFloat(request.body.cheekbone),
    forehead: parseFloat(request.body.forehead),
  };
  console.log("Processed facial data:", facialData);

  response.json({ shape: "A shape" });
}

shapeAnalysisRouter.route("/analyzeShape").post(upload.single("image"), processImage);

export default shapeAnalysisRouter;
