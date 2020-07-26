import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import { validationResult } from "express-validator";
import User from "../models/Users";

const GetUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("name email date");
    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }
    res.status(200).json({
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const AuthUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await jwt.sign(payload, config.get("jwtSecret"), {
      expiresIn: 3600,
    });
    if (token) {
      return res.status(200).json({
        token,
      });
    } else {
      return res.status(400).json({
        message: "Token could not be generated",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server error");
  }
};

export { AuthUser, GetUser };
