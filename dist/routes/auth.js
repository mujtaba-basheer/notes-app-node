"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const authRouter = (0, express_1.Router)();
// user signup
authRouter.post("/signup", auth_1.signup);
// user login
authRouter.post("/login", auth_1.login);
// user logout
authRouter.get("/logout", auth_2.protect, auth_1.logout);
exports.default = authRouter;
