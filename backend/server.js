import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as db from "./connect.js";
import styleSheetRoutes from "./routes/stylesheetRoutes.js";
import hairStylesRoutes from "./routes/hairstylesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(styleSheetRoutes);
app.use(hairStylesRoutes);

app.listen(PORT, () => {
  db.connectToDb()
    .then(() => {
      console.log(`Connected to database: ${process.env.DB_NAME}`);
      console.log(`Server is running on port ${PORT}`);
    })
    .catch((err) => {
      console.error("Failed to connect to the database:", err);
      process.exit(1);
    });
});
