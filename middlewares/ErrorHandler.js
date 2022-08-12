const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "SequelizeValidationError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({
        message: "This email is already being used. Please use another email.",
      });
      break;
    case "JsonWebTokenError":
      res.status(400).json({ message: "Token expired" });
      break;
    case "UserNotFound":
      res.status(404).json({ message: "User not found" });
      break;
    case "NotAdmin":
      res.status(401).json({ message: "You are not eligible to sign in" });
      break;
    case "Unauthorized":
      res.status(401).json({ message: "Please login first" });
      break;
    case "Forbidden":
      res.status(403).json({ mesasge: "Your are not authorized" });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};

module.exports = errorHandler;
