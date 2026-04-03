const { hasPermission } = require("../config/roles");

// Middleware factory: checks if user's role has permission for a resource/action
const authorize = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!hasPermission(req.user.role, resource, action)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' cannot '${action}' on '${resource}'.`,
      });
    }

    next();
  };
};

module.exports = { authorize };
