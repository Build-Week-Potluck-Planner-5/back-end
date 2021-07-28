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

router.get('/:potluck_id', async (req, res, next) => {
  try {
    const potluck = await Potluck.getPotluckById(req.params.potluck_id);
    res.status(200).json(potluck);
  } catch (err) {
    next(err);
  }
})

module.exports = router;

// {
//     potluck_id: 1,
//     potluck_name: "cookout",
//     organizer_id: 1,
//     location: "park",
//     invites: [
//         {
//             user_id: 2,
//             username: "foo"
//         }
//     ],
//     attendees: [
//         {
//             user_id: 3,
//             username: "bar"
//         }
//     ],
//     food: [
//         {
//             food_id: 1,
//             food_name: "hamburgers",
//             user_id: null
//         },
//         {
//             food_id: 2,
//             food_name: "watermelon",
//             user_id: 2
//         }
//     ]
// }
