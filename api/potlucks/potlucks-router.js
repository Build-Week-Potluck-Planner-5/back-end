const router = require("express").Router();
const Potluck = require("./potlucks-model");

router.get("/", async (req, res, next) => {
  const { subject } = req.decodedJWT;
  try {
    const potlucks = await Potluck.getUserAttending(subject);
    res.status(200).json(potlucks);
  } catch (err) {
    next(err);
  }
});

router.get("/invites", async (req, res, next) => {
  const { subject } = req.decodedJWT;
  try {
    const invites = await Potluck.getUserInvites(subject);
    res.status(200).json(invites);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
