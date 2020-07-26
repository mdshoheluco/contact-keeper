import express from "express";
import { body } from "express-validator";
import { ADD_USER } from "../controllers/Users";
const router = express.Router();

router.post(
  "/",
  [
    body("name", "name is required").not().isEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  ADD_USER
);

export default router;
