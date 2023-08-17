"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const auth_1 = require("../utils/auth");
const user_1 = require("../models/user");
const app_error_1 = require("../utils/app-error");
const signup = async (req, res, next) => {
    try {
        const { fname, lname, email, password, passwordConfirm } = req.body;
        const newUser = await user_1.default.create({
            fname,
            lname,
            email,
            password,
            passwordConfirm,
        });
        const jwtData = {
            fname: newUser.fname,
            _id: newUser._id.toString(),
        };
        (0, auth_1.createSendToken)(jwtData, 201, req, res);
    }
    catch (error) {
        // console.error(error);
        console.log(error.message);
        return next(new app_error_1.default(error.message, 501));
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    // Check if email and password exist
    if (!email || !password) {
        return next(new app_error_1.default("Please provide email and password!", 400));
    }
    // Check if user exists && password is correct
    const user = await user_1.default.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new app_error_1.default("Incorrect email or password", 401));
    }
    const jwtData = {
        fname: user.fname,
        _id: user._id.toString(),
    };
    // If everything ok, send token to client
    (0, auth_1.createSendToken)(jwtData, 200, req, res);
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("jwt", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
exports.logout = logout;
