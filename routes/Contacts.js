import express from "express";
import { body, validationResult } from "express-validator";
import Auth from "../middlewares/Auth";
import Contact from "../models/Contacts";

const router = express.Router();

router.get("/", Auth, async (req, res, next) => {
  try {
    const contacts = await Contact.find({ user: req.user.id });
    res.status(200).json(contacts);
  } catch (err) {}
});

// router.get("/:id", (req, res, next) => {
//   res.status(200).json({
//     message: "Get signle contact",
//   });
// });

router.post(
  "/",
  [
    Auth,
    [
      body("name", "Please enter your name").not().isEmpty(),
      body("email", "Please enter a valid email").isEmail(),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }
    try {
      const { name, email, phone, type } = req.body;
      const newContact = {};

      if (name) newContact.name = name;
      if (email) newContact.email = email;
      if (phone) newContact.phone = phone;
      if (type) newContact.type = type;
      newContact.user = req.user.id;

      const contact = new Contact(newContact);
      const savedContact = await contact.save();
      res.status(201).json({
        contact: savedContact,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.put("/:id", Auth, async (req, res, next) => {
  const { name, email, phone, type } = req.body;
  const newContact = {};

  if (name) newContact.name = name;
  if (email) newContact.email = email;
  if (phone) newContact.phone = phone;
  if (type) newContact.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: newContact },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", Auth, async (req, res, next) => {
  const id = req.params.id;
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    await Contact.findByIdAndRemove(id);
    res.status(200).json({
      message: "Deleted contact successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
