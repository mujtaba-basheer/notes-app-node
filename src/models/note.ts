import { Schema, model, Model, ObjectId } from "mongoose";

interface NoteI {
  title: string;
  description: string;
  user: ObjectId;
  priority: number;
  date_added: Date;
  last_modified: Date;
}

const noteSchema = new Schema<NoteI, Model<NoteI, any, any>>({
  title: {
    type: String,
    required: [true, "Please add a title for the note"],
  },
  description: {
    type: String,
    required: [true, "Please add a description for the note"],
  },
  user: {
    type: Schema.Types.ObjectId,
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

const Note = model("Note", noteSchema);

export default Note;
