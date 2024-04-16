import { db } from '../db/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register controller
export const register = (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // Save user to the database
  db.collection('users').insertOne({ username, email, password: hash })
    .then(() => {
      res.status(200).json({ message: 'User has been registered successfully' });
    })
    .catch(error => {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

// Login controller
export const login = (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  db.collection('users').findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare passwords
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, 'jwtsecret', { expiresIn: '1h' });

      res.cookie('access_token', token, { httpOnly: true }).status(200).json({ message: 'Logged in successfully' });
    })
    .catch(error => {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

// Logout controller
export const logout = (req, res) => {
  res.clearCookie('access_token').status(200).json({ message: 'Logged out successfully' });
};
