import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { JwtDecodedT } from "../index.d";
import { config } from "dotenv";
config();

// sign jwt token
export const signToken: (user: JwtDecodedT) => string = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// create send token
export const createSendToken = (
  user: JwtDecodedT,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + +process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
