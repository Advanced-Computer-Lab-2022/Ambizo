import express from "express";
import cors from "cors";
import corporateTrainee from "./routes/corporateTrainee.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/corporateTrainee", corporateTrainee);
app.use("*", (req, res) => res.status(404).send("Error: Not Found"));

export default app;