import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as db from "./connect.js";
import styleSheetRoutes from "./routes/stylesheetRoutes.js";
import hairStylesRoutes from "./routes/hairstylesRoutes.js";
import shapeAnalysisRoutes from "./routes/shapeAnalysisRoutes.js";

dotenv.config(); // loads options from .env file (like db key)

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(styleSheetRoutes);
app.use(hairStylesRoutes);
app.use(shapeAnalysisRoutes);

app.listen(PORT, () => {
  db.connectToDb()
    .then(() => {
      console.log(`Connected to database: ${process.env.DB_NAME}`);
      console.log(`Server is running on http://localhost:${PORT}/`);
    })
    .catch((err) => {
      console.error("Failed to connect to the database:", err);
      process.exit(1);
    });
});
