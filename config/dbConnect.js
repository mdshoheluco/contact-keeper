import mongoose from "mongoose";
import config from "config";
const db = config.get("mongoURI");

const dbConnect = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to Database");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default dbConnect;
