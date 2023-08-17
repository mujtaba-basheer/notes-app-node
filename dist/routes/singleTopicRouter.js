"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const singleTopic_1 = require("../apis/singleTopic");
const auth_1 = require("../middleware/auth");
const singleTopicRouter = (0, express_1.Router)();
// get all topics A2Z
singleTopicRouter.get("/single", auth_1.checkLogin, singleTopic_1.getSingleTopic);
exports.default = singleTopicRouter;
