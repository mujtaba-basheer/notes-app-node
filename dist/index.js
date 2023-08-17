"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors_1 = require("./middleware/cors");
// importing routes
const auth_1 = require("./routes/auth");
const note_1 = require("./routes/note");
// error handlers
const error_1 = require("./controllers/error");
// Start express app
const app = express();
// Implement CORS
app.use((0, cors_1.default)());
app.options("*", (0, cors_1.default)());
// Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// ROUTES
app.use("/api/auth", auth_1.default);
app.use("/api/notes", note_1.default);
app.use(error_1.default);
exports.default = app;
