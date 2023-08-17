import { Request, Response, NextFunction } from "express";
import { decode, Jwt, JwtPayload, Secret, verify } from "jsonwebtoken";
import AppError from "../utils/app-error";

export const protect = async (
  req: Request & { user: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization;
    let token: string;
    if (bearerToken && bearerToken.startsWith("Bearer ")) {
      token = bearerToken.split(" ")[1];
    } else if (req.cookies["jwt"]) {
      token = req.cookies["jwt"];
    }
    if (token) {
      verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            const user = decode(token);
            req.user = user;
            next();
          } else {
            console.error(err);
            throw new AppError("Token Invalid or Expired", 403);
          }
        } else {
          req.user = payload;
          next();
        }
      });
    } else throw new Error("Unauthorized");
  } catch (error) {
    return next(new AppError(error.message, error.statusCode || 401));
  }
};

export const checkLogin = async (
  req: Request & { user: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization;
    let token: string;
    if (bearerToken && bearerToken.startsWith("Bearer ")) {
      token = bearerToken.split(" ")[1];
    } else if (req.cookies["jwt"]) {
      token = req.cookies["jwt"];
    }
    if (token) {
      // token = decrypt(token);
      try {
        const user = verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
      } catch (error) {
        console.error(error);
        next();
      }
    } else next();
  } catch (error) {
    return next(new AppError(error.message, error.statusCode || 401));
  }
};
