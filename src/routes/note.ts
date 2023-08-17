import { Router } from "express";
import {
  addNote,
  getNotes,
  getNoteById,
  editNote,
  deleteNoteById,
  reorderNotes,
} from "../controllers/note";
import { protect } from "../middleware/auth";

const noteRouter = Router();

// add a note
noteRouter.post("/", protect, addNote);

// reorder notes
noteRouter.put("/reorder", protect, reorderNotes);

// edit a note
noteRouter.put("/:id", protect, editNote);

// get all notes
noteRouter.get("/", protect, getNotes);

// get single note by id
noteRouter.get("/:id", protect, getNoteById);

// delete a note by id
noteRouter.delete("/:id", protect, deleteNoteById);

export default noteRouter;
