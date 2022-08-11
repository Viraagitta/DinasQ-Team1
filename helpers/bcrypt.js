const bcrypt = require("bcryptjs");

const hashPassword = (password, num) => {
  return bcrypt.hashSync(password, num);
};

const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { hashPassword, verifyPassword };
