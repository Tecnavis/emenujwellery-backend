// /middleware/authMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  }
  
  module.exports = isAuthenticated;
  