const router = require('express').Router();
const Potluck = require('./potlucks-model');

router.get('/', async (req, res, next) => {
    try {
        const potlucks = await Potluck.get();
        res.status(200).json(potlucks);
    } catch (err) {
        next(err);
    }
})

module.exports = router;