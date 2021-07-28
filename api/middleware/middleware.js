const User = require("../users/users-model");

const checkUsernameExists = async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findBy({ username });
  if (user.length > 0) {
    req.user = user[0];
    next();
  } else {
    next({
      status: 401,
      message: "username does not exist",
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

module.exports = {
  checkUsernameExists,
  checkRequiredFields,
};
