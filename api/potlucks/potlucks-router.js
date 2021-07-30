const router = require("express").Router();
const Potluck = require("./potlucks-model");
const { checkPotluckExists, checkInvite } = require("../middleware/middleware");

router.post("/", async (req, res, next) => {
  const potluck = {
    ...req.body,
    organizer_id: req.decodedJWT.subject,
  };

  try {
    const newPotluck = await Potluck.addPotluck(potluck);
    res.status(201).json(newPotluck);
  } catch (err) {
    next(err);
  }
});

router.get("/foods", async (req, res, next) => {
  try {
    const foodList = await Potluck.getAllFoods();
    res.status(200).json(foodList);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  const { subject } = req.decodedJWT;
  try {
    const potlucks = await Potluck.getGuestPotlucks(subject);
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

router.get("/:potluck_id", checkPotluckExists, async (req, res, next) => {
  try {
    const potluck = await Potluck.getPotluck(req.params.potluck_id);
    res.status(200).json(potluck);
  } catch (err) {
    next(err);
  }
});

router.put("/invites/:invite_id", async (req, res, next) => {});

router.put("/:potluck_id/:food_id/assign", async (req, res, next) => {
  console.log("decoded token", req.decodedJWT);
  const { subject } = req.decodedJWT;
  try {
    const potluck = await Potluck.guestUpdateFood(
      req.params.potluck_id,
      req.params.food_id,
      subject
    );
    res.status(200).json(potluck);
  } catch (err) {
    next(err);
  }
});

router.put("/:potluck_id/:food_id/cancel", async (req, res, next) => {
  try {
    const potluck = await Potluck.guestCancelFood(
      req.params.potluck_id,
      req.params.food_id
    );
    res.status(200).json(potluck);
  } catch (err) {
    next(err);
  }
});

router.put("/:potluck_id/rsvp", checkPotluckExists, checkInvite, async (req, res, next) => {
  const { inviteInfo } = req;
  try {
    const updatedInvite = await Potluck.guestRSVP(inviteInfo);
    res.status(200).json(updatedInvite);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
