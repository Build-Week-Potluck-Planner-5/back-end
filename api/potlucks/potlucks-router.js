const router = require("express").Router();
const Potluck = require("./potlucks-model");
const { checkPotluckExists } = require('../middleware/middleware');

router.post("/", async (req, res, next) => {
  
  const potluck = {
    ...req.body,
    organizer_id: req.decodedJWT.subject
  }

  try {
    const newPotluck = await Potluck.addPotluck(potluck);
    res.status(201).json(newPotluck);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  const { subject } = req.decodedJWT;
  try {
    const potlucks = await Potluck.getUserPotlucks(subject);
    res.status(200).json(potlucks);
  } catch (err) {
    next(err);
  }
});

// router.put('/' async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err);
//   }
// })

// router.delete('/' async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err);
//   }
// })

// router.post('/' async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err);
//   }
// })

router.get("/invites", async (req, res, next) => {
  const { subject } = req.decodedJWT;
  try {
    const invites = await Potluck.getUserInvites(subject);
    res.status(200).json(invites);
  } catch (err) {
    next(err);
  }
});

// router.put('/' async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err);
//   }
// })

// router.delete('/' async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err);
//   }
// })

// router.post('/' async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err);
//   }
// })

router.get("/:potluck_id", checkPotluckExists, async (req, res, next) => {
  try {
    const potluck = await Potluck.getPotluck(req.params.potluck_id);
    res.status(200).json(potluck);
  } catch (err) {
    next(err);
  }
});

// router.put('/' async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err);
//   }
// })

// router.delete('/' async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err);
//   }
// })

module.exports = router;
