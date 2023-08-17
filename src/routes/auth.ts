import { Router } from "express";
import { signup, login, logout } from "../controllers/auth";
import { protect } from "../middleware/auth";

const authRouter = Router();

// user signup
authRouter.post("/signup", signup);

// user login
authRouter.post("/login", login);

// user logout
authRouter.get("/logout", protect, logout);

export default authRouter;
