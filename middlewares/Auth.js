import jwt from "jsonwebtoken";
import config from "config";

const jwtSecret = config.get("jwtSecret");

const Auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
  try {
    const decoded = await jwt.verify(token, jwtSecret);
    if (decoded) {
      req.user = decoded.user;
    } else {
      return res.status(401).json({ message: "Authorization denied" });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export default Auth;
