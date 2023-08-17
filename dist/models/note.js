"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Please add a title for the note"],
    },
    description: {
        type: String,
        required: [true, "Please add a description for the note"],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    priority: {
        type: Number,
        required: [true, "Priority is required"],
    },
    date_added: Date,
    last_modified: Date,
});
noteSchema.pre("save", function (next) {
    const date = new Date();
    this.date_added = date;
    this.last_modified = date;
    next();
});
const Note = (0, mongoose_1.model)("Note", noteSchema);
exports.default = Note;
