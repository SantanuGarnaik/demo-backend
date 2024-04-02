require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');

const app = express();
let PORT = process.env.PORT || 3000;
const USERS_FILE_PATH = 'users.json';
const JWT_SECRET = 'your_secret_key'; // Change this to a strong secret key

// Middleware
app.use(bodyParser.json());

// Initialize users array
let users = [];

// Read users data from file on server start
(async () => {
  try {
    const data = await fs.readFile(USERS_FILE_PATH);
    users = JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Create empty users file if not exists
      await fs.writeFile(USERS_FILE_PATH, '[]');
    } else {
      console.error('Error reading users data:', error);
    }
  }
})();

// Save users data to file
async function saveUsersToFile() {
  try {
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users data:', error);
  }
}

// Generate JWT token
function generateToken(email) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
}

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

  // Store user in memory and save to file
  const newUser = { email, password };
  users.push(newUser);
  saveUsersToFile();

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

  // Generate JWT token
  const token = generateToken(email);

  // Send token in response
  res.status(200).json({ message: 'Login successful', token });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
