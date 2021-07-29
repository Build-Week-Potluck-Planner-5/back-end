const router = require('express').Router()
const Users = require('./users-model')

router.get('/', async (req, res, next) => {
  try {
    const users = await Users.get()
    if(!users) {
      next({status: 404, message: 'no users found'})
    } else {
      res.json(users)
    }
  } catch(err) {
    next(err)
  }
})


module.exports = router