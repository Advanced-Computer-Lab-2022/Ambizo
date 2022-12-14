import app from "./server.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import mailCertificates from "./cron/mailCertificates.js";

dotenv.config();
const port = process.env.PORT || "8000";

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
    wtimeoutMS: 2500, 
    useNewUrlParser: true
})
.then(() => {
    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}`);
    })
})
.catch(err => {
    console.log(err.stack);
    process.exit(1);
});

//cron jobs scheduling
mailCertificates.start();
