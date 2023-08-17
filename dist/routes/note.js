"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const note_1 = require("../controllers/note");
const auth_1 = require("../middleware/auth");
const noteRouter = (0, express_1.Router)();
// add a note
noteRouter.post("/", auth_1.protect, note_1.addNote);
// reorder notes
noteRouter.put("/reorder", auth_1.protect, note_1.reorderNotes);
// edit a note
noteRouter.put("/:id", auth_1.protect, note_1.editNote);
// get all notes
noteRouter.get("/", auth_1.protect, note_1.getNotes);
// get single note by id
noteRouter.get("/:id", auth_1.protect, note_1.getNoteById);
// delete a note by id
noteRouter.delete("/:id", auth_1.protect, note_1.deleteNoteById);
exports.default = noteRouter;
