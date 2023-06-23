var express = require('express');
// Middleware to authenticate the user
const authenticateUser = async (req, res, next) => {
    const { authorization } = req.headers;
  
    if (!authorization || !authorization.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    const idToken = authorization.split('Bearer ')[1];
  
    try {
      // Verify the ID token to get the user's UID
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.uid = decodedToken.uid;
      next();
    } catch (error) {
      console.error('Error verifying ID token:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
  module.exports = authenticateUser;