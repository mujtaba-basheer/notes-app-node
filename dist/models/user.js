"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const userSchema = new mongoose_1.Schema({
    fname: {
        type: String,
        required: [true, "Please tell us your first name!"],
    },
    lname: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (val) {
                const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
                return regex.test(val);
            },
            message: "Please provide a valid email address",
        },
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [8, "Password must have atleast 8 characters"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (val) {
                return val === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
}, {
    methods: {
        async correctPassword(candidatePassword, userPassword) {
            return await (0, bcryptjs_1.compare)(candidatePassword, userPassword);
        },
    },
    collection: "users",
});
userSchema.pre("save", async function (next) {
    this.password = await (0, bcryptjs_1.hash)(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
