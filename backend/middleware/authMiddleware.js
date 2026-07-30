const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "rxconnect_secret_key");
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token invalid or expired." });
    }
  }

  // Fallback testing support when header `x-user-id` and `x-user-role` are passed directly in Postman/dev mode
  if (req.headers["x-user-id"]) {
    req.user = {
      id: req.headers["x-user-id"],
      role: req.headers["x-user-role"] || "DELIVERY_PARTNER",
      branchId: req.headers["x-branch-id"] || null,
    };
    return next();
  }

  return res.status(401).json({ success: false, message: "Not authorized, no token provided." });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role || "UNKNOWN"}' is not authorized to access this resource. Required: [${roles.join(", ")}]`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
