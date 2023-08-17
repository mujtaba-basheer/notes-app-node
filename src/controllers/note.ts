import { NextFunction, Request, Response } from "express";
import { Query } from "mongoose";
import Note from "../models/note";
import AppError from "../utils/app-error";
import { AddNoteDataT, JwtDecodedT } from "../index.d";

export const addNote = async (
  req: Request & { user: JwtDecodedT },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body as AddNoteDataT;
    const { _id } = req.user;

    await Note.create({
      title,
      description,
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
      .sort({ date_added: -1 })
      .select("title description");

    const notes = await query.exec();

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

export const deletNoteById = async (
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
