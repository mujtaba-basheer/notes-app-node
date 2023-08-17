"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderNotes = exports.deleteNoteById = exports.getNoteById = exports.getNotes = exports.editNote = exports.addNote = void 0;
const mongoose_1 = require("mongoose");
const note_1 = require("../models/note");
const app_error_1 = require("../utils/app-error");
const addNote = async (req, res, next) => {
    try {
        const { title, description, sl_no } = req.body;
        const { _id } = req.user;
        let priority = sl_no;
        if (priority === undefined) {
            priority = await note_1.default.count({ user: _id });
        }
        await note_1.default.create({
            title,
            description,
            priority,
            user: _id,
        });
        res.status(201).json({
            status: "success",
            message: "Note added successfully",
        });
    }
    catch (error) {
        console.error(error);
        return next(new app_error_1.default(error.message, 501));
    }
};
exports.addNote = addNote;
const editNote = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { _id: userId } = req.user;
        const { id: noteId } = req.params;
        const date = new Date();
        await note_1.default.findOneAndUpdate({ _id: noteId, user: userId }, {
            title,
            description,
            last_modified: date,
        });
        res.status(201).json({
            status: "success",
            message: "Note updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        return next(new app_error_1.default(error.message, 501));
    }
};
exports.editNote = editNote;
const getNotes = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const query = note_1.default.find({ user: _id })
            .sort({ priority: -1 })
            .select("title description priority");
        const notes = await query.exec();
        notes.forEach((note) => {
            if (note.description.length > 100) {
                note.description = note.description.substring(0, 99) + "...";
            }
        });
        res.status(200).json({
            status: "success",
            data: notes,
        });
    }
    catch (error) {
        console.error(error);
        return next(new app_error_1.default(error.message, 501));
    }
};
exports.getNotes = getNotes;
const getNoteById = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { id: noteId } = req.params;
        const query = note_1.default.findOne({ _id: noteId, user: userId })
            .sort({ date_added: -1 })
            .select("title description");
        const note = await query.exec();
        if (note) {
            res.status(200).json({
                status: "success",
                data: note,
            });
        }
        else {
            return next(new app_error_1.default("No note found with id", 404));
        }
    }
    catch (error) {
        console.error(error);
        return next(new app_error_1.default(error.message, 501));
    }
};
exports.getNoteById = getNoteById;
const deleteNoteById = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { id: noteId } = req.params;
        const query = note_1.default.findOneAndDelete({ _id: noteId, user: userId });
        await query.exec();
        res.status(200).json({
            status: "success",
            message: "Note deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return next(new app_error_1.default(error.message, 501));
    }
};
exports.deleteNoteById = deleteNoteById;
const reorderNotes = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const order = req.body;
        const updateArray = order.map((info) => ({
            updateOne: {
                filter: {
                    _id: new mongoose_1.Types.ObjectId(info._id),
                    user: userId,
                },
                update: {
                    priority: info.priority,
                },
            },
        }));
        await note_1.default.bulkWrite(updateArray);
        res.status(200).json({
            status: "success",
        });
    }
    catch (error) {
        console.error(error);
        return next(new app_error_1.default(error.message, 501));
    }
};
exports.reorderNotes = reorderNotes;
