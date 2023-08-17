export type UserRegisterDataT = {
  fname: string;
  lname?: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type UserLoginDataT = {
  email: string;
  password: string;
};

export type UserT = {
  fname: string;
  lname: string;
  email: string;
  password: string;
};

export type JwtDecodedT = {
  _id: string;
  fname: string;
};

export type NoteT = {
  title: string;
  description: string;
  user: ObjectId;
  date_added: Date;
  last_modified: Date;
};

export type AddNoteDataT = {
  title: string;
  description: string;
};
