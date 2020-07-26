import express from "express";
import dbConnect from "./config/dbConnect";
import AuthRoute from "./routes/Auth";
import UsersRoute from "./routes/Users";
import ContactsRoute from "./routes/Contacts";

const port = process.env.PORT | 5000;

// Connect to the database
dbConnect();
const app = express();

app.use(express.json({ extended: false }));

app.use("/api/auth", AuthRoute);
app.use("/api/users", UsersRoute);
app.use("/api/contacts", ContactsRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
