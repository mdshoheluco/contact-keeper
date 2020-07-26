import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import { validationResult } from "express-validator";
import User from "../models/Users";

const jwtSecret = config.get("jwtSecret");

const ADD_USER = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = await jwt.sign(payload, jwtSecret, {
      expiresIn: 3600,
    });
    if (token) {
      res.status(201).json({
        token,
      });
    } else {
      res.status(400).send("Bad request");
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Bad request");
  }
};

export { ADD_USER };
