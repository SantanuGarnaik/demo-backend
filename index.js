require('dotenv').config()
const express = require("express");
const app = express();

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// User data stored in memory (replace with database in production)
const users = [];

// Routes
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Simple password validation
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // Check if email is already registered
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Store user in memory
  const newUser = { email, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Successful login
  res.status(200).json({ message: 'Login successful' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

