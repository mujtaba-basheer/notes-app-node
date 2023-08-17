import * as express from "express";
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
import cors from "./middleware/cors";

// importing routes
import authRouter from "./routes/auth";
import noteRouter from "./routes/note";

// error handlers
import globalErrorHandler from "./controllers/error";

// Start express app
const app = express();

// Implement CORS
app.use(cors());

app.options("*", cors());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);

app.use(globalErrorHandler);

export default app;
