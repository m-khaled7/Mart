import express from "express";
import ErrorHandler from "./middlewares/Error.middleware.js";
import router from "./routes.js";
const app = express();

app.use(express.json());
app.use("/api",router)
app.use(ErrorHandler);

export {app}
