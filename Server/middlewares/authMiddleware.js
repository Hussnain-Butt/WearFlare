// Server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken')
// You might need to import your User/Admin/PM models if you need to fetch user details
// const User = require('../models/User');
// const Admin = require('../models/adminModel');
// const ProductManager = require('../models/productManagerModel');

const protect = (allowedRoles) => {
  // Pass allowed roles as an array
  return (req, res, next) => {
    let token
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        // Get token from header (e.g., "Bearer YOUR_TOKEN")
        token = authHeader.split(' ')[1]

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // IMPORTANT: The decoded payload MUST contain the user's ID and ROLE
        // Ensure your login functions (adminLogin, productManagerLogin) include the role in the JWT payload
        if (!decoded.id || !decoded.role) {
          console.error('JWT Verification Error: Token payload missing id or role.')
          return res.status(401).json({ message: 'Not authorized, invalid token payload' })
        }

        // Attach user id and role to the request object for later use
        req.user = { id: decoded.id, role: decoded.role }

        // Check if the user's role is allowed for this route
        // Ensure allowedRoles is always treated as an array
        const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : []
        if (rolesToCheck.length > 0 && !rolesToCheck.includes(decoded.role)) {
          // Role is not permitted
          console.warn(
            `Authorization Denied: Role '${decoded.role}' not in allowed roles [${rolesToCheck.join(
              ', ',
            )}] for ${req.originalUrl}`,
          )
          // Return 403 Forbidden status
          return res
            .status(403)
            .json({ message: 'Forbidden: You do not have permission to perform this action' })
        }

        // Role is allowed, proceed to the next middleware or route handler
        next()
      } catch (error) {
        console.error('Token verification failed:', error.message)
        // Handle specific JWT errors if needed (e.g., TokenExpiredError)
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Not authorized, invalid token' })
        }
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Not authorized, token expired' })
        }
        res.status(401).json({ message: 'Not authorized, token failed' })
      }
    }

    // If no token is found in the header
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token provided' })
    }
  }
}

module.exports = { protect }
