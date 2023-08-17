"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSendToken = exports.signToken = void 0;
const jwt = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// sign jwt token
const signToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.signToken = signToken;
// create send token
const createSendToken = (user, statusCode, req, res) => {
    const token = (0, exports.signToken)(user);
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + +process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
exports.createSendToken = createSendToken;
