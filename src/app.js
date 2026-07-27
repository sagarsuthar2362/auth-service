import express from "express";
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use(errorHandler);
export default app;
