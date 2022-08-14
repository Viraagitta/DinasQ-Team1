const jwt = require("jsonwebtoken");

const signPayload = (payload) => {
  return jwt.sign(payload, process.env.SECREY_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECREY_KEY);
};

module.exports = { signPayload, verifyToken };


