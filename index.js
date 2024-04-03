require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET_KEY || "your_secret_key";

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using Mongoose
try {
  mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
}

// Define a schema for the user collection
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
  },
  { timestamps: true }
);

// Create a Mongoose model for the user collection
const User = mongoose.model("User", userSchema);

// Routes
app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create a new user
    await User.create({ fullName, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  // Here you may want to handle any logout logic, such as invalidating the JWT token.
  // For simplicity, let's just send a success response.

  res.status(200).json({ message: "Logout successful" });
});

// Get user details route
// Get user details route
// Get user details route
app.get("/user", async (req, res) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  // Extract token from Authorization header (remove 'Bearer ' prefix)
  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    // If decoded object is null or undefined, indicating an invalid token
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail }, { password: 0 });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    // If the error is a JsonWebTokenError, indicating an invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Edit user details route
app.put("/user", async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(" ")[1];

  const { fullName, email, password } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.password = password || user.password;

    await user.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user account route
app.delete("/user", async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    // Find user by email and delete
    const deletedUser = await User.findOneAndDelete({ email: userEmail });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
