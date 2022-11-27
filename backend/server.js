import express from "express";
import cors from "cors";
import corporateTrainee from "./routes/corporateTrainee.route.js";
import guest from "./routes/guest.route.js";
import instructor from "./routes/instructor.route.js";
import administrator from "./routes/administrator.route.js";
import password from "./routes/password.route.js"
import user from "./routes/user.route.js";


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/guest", guest);
app.use("/api/user", user);
app.use("/api/admin", administrator);
app.use("/api/instructor", instructor);
app.use("/api/corporateTrainee", corporateTrainee);
app.use("/api/password", password);
app.use("*", (req, res) => res.status(404).send("Error: Not Found"));



export default app;