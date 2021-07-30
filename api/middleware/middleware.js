const User = require("../users/users-model");
const Potluck = require("../potlucks/potlucks-model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");

const checkUsernameExists = async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findBy({ username });

  if (req.originalUrl === "/api/auth/login") {
    if (user.length > 0) {
      req.user = user[0];
      next();
    } else {
      next({
        status: 401,
        message: "username does not exist",
      });
    }
  } else {
    if (user.length > 0) {
      next({
        status: 401,
        message: "username taken",
      });
    } else {
      next();
    }
  }
};

const checkPotluckExists = async (req, res, next) => {
  const { potluck_id } = req.params;
  const [potluck] = await Potluck.findPotluckById(potluck_id);
  if (potluck) {
    next();
  } else {
    next({
      status: 401,
      message: "potluck not found",
    });
  }
};

const checkRequiredFields = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      status: 401,
      message: "username and password are required",
    });
  } else {
    next();
  }
};

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next({
      status: 401,
      message: "token required",
    });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        next({
          status: 401,
          message: "invalid token",
        });
      }
      req.decodedJWT = decodedToken;
      console.log(decodedToken);
      next();
    });
  }
};

const checkInvite = async (req, res, next) => {
  const { subject } = req.decodedJWT;
  const { potluck_id } = req.params;
  const inviteInfo = {
    attending: req.body.attending,
    user_id: subject,
    potluck_id: potluck_id,
  };
  const findInvite = await Potluck.findInvite(inviteInfo);
  if (findInvite) {
    req.inviteInfo = inviteInfo;
    next();
  } else {
    next({
      status: 401,
      message: "invite not found",
    });
  }
};

module.exports = {
  checkUsernameExists,
  checkPotluckExists,
  checkRequiredFields,
  restricted,
  checkInvite,
};
