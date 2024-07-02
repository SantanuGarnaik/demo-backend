import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  // Check for token in cookies
  const cookieToken = req.cookies.access_token;

  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  let headerToken;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    headerToken = authHeader.split(" ")[1];
  }

  // Use token from cookies if present, otherwise use token from header
  const token = cookieToken || headerToken;
  console.log(token);
  if (!token) {
    // If no token is found
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    console.log("secret", process.env.JWT_SECRET_KEY);
    console.error(err);
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Attach user ID to request object for further use
    req.userId = decodedToken.id;
    next();
  });
};
