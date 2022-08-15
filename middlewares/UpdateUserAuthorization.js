const { User } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return next({ name: "UserNotFound" });
    if (req.user.role != "Super Admin" && req.user.role != "Admin") {
      return next({ name: "Forbidden" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authorization;
