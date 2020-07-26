import express from "express";
import { body } from "express-validator";
import { AuthUser, GetUser } from "../controllers/Auth";
import Auth from "../middlewares/Auth";

const router = express.Router();

router.get("/", Auth, GetUser);

router.post(
  "/",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  AuthUser
);

export default router;
