"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feed_1 = require("../apis/feed");
const feedRouter = (0, express_1.Router)();
// get latest feed
feedRouter.get("/", feed_1.getYTFeed);
exports.default = feedRouter;
