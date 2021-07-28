const bcrypt = require("bcryptjs");
const router = require("express").Router();
const User = require("../users/users-model");
const tokenBuilder = require("./token-builder");
const { checkRequiredFields, checkUsernameExists } = require("../middleware/middleware");

router.post("/register", checkRequiredFields, checkUsernameExists, async (req, res, next) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  try {
    const newUser = await User.add(user);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", checkRequiredFields, checkUsernameExists, async (req, res, next) => {
  const { password } = req.body;
  const { user } = req;

  if (user && bcrypt.compareSync(password, user.password)) {
      const token = tokenBuilder(user);
      res.status(200).json({
          message: `welcome, ${user.username}`,
          token,
      });
  } else {
      next({
          status: 401,
          message: 'invalid credentials',
      })
  }
});

module.exports = router;
