import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import Note from "../models/note";
import AppError from "../utils/app-error";
import {
  AddNoteDataT,
  JwtDecodedT,
  ReorderNotesDataT,
  UpdateArrayT,
} from "../index.d";

export const addNote = async (
  req: Request & { user: JwtDecodedT },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, sl_no } = req.body as AddNoteDataT;
    const { _id } = req.user;

    let priority: number = sl_no;
    if (priority === undefined) {
      priority = await Note.count({ user: _id });
    }

    await Note.create({
      title,
      description,
      priority,
      user: _id,
    });

    res.status(201).json({
      status: "success",
      message: "Note added successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 501));
  }
};

export const editNote = async (
  req: Request & { user: JwtDecodedT },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body as AddNoteDataT;
    const { _id: userId } = req.user;
    const { id: noteId } = req.params;
    const date = new Date();

    await Note.findOneAndUpdate(
      { _id: noteId, user: userId },
      {
        title,
        description,
        last_modified: date,
      }
    );

    res.status(201).json({
      status: "success",
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 501));
  }
};

export const getNotes = async (
  req: Request & { user: JwtDecodedT },
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user;

    const query = Note.find({ user: _id })
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
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 501));
  }
};

export const getNoteById = async (
  req: Request & { user: JwtDecodedT },
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: userId } = req.user;
    const { id: noteId } = req.params;

    const query = Note.findOne({ _id: noteId, user: userId })
      .sort({ date_added: -1 })
      .select("title description");

    const note = await query.exec();

    if (note) {
      res.status(200).json({
        status: "success",
        data: note,
      });
    } else {
      return next(new AppError("No note found with id", 404));
    }
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 501));
  }
};

export const deleteNoteById = async (
  req: Request & { user: JwtDecodedT },
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: userId } = req.user;
    const { id: noteId } = req.params;

    const query = Note.findOneAndDelete({ _id: noteId, user: userId });
    await query.exec();

    res.status(200).json({
      status: "success",
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 501));
  }
};

export const reorderNotes = async (
  req: Request & { user: JwtDecodedT },
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: userId } = req.user;
    const order = req.body as ReorderNotesDataT;

    const updateArray: UpdateArrayT = order.map((info) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(info._id),
          user: userId,
        },
        update: {
          priority: info.priority,
        },
      },
    }));
    await Note.bulkWrite(updateArray);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 501));
  }
};
