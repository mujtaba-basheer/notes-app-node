import { NextFunction, Request, Response } from "express";
import { createSendToken } from "../utils/auth";
import User from "../models/user";
import AppError from "../utils/app-error";
import { UserRegisterDataT, UserLoginDataT, JwtDecodedT } from "../index.d";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fname, lname, email, password, passwordConfirm } =
      req.body as UserRegisterDataT;

    const newUser = await User.create({
      fname,
      lname,
      email,
      password,
      passwordConfirm,
    });

    const jwtData: JwtDecodedT = {
      fname: newUser.fname,
      _id: newUser._id.toString(),
    };

    createSendToken(jwtData, 201, req, res);
  } catch (error) {
    // console.error(error);
    console.log(error.message);
    return next(new AppError(error.message, 501));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as UserLoginDataT;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const jwtData: JwtDecodedT = {
    fname: user.fname,
    _id: user._id.toString(),
  };

  // If everything ok, send token to client
  createSendToken(jwtData, 200, req, res);
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
