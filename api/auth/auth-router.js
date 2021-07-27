const bcrypt = require("bcryptjs");
const router = require("express").Router();
const User = require("../users/users-model");
// const tokenBuilder = require('./token-builder');

router.post("/register", async (req, res, next) => {
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

module.exports = router;
