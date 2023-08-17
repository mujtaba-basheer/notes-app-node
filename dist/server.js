"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
const index_1 = require("./index");
(0, dotenv_1.config)();
const MONGODB_URI = process.env.MONGODB_URI.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
(0, mongoose_1.connect)(MONGODB_URI, { dbName: "notes-app" }).then(() => console.log("DB connection successful!"));
const port = process.env.PORT || 3000;
index_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
