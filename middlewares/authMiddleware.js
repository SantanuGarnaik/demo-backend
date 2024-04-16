import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // Get the token from the request cookies
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Attach user ID to request object for further use
    req.userId = decodedToken.id;
    next();
  });
};
