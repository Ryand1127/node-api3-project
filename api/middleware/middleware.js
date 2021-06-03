const User = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(
    `Request Method: ${req.method}, Request URL: ${req.url}, Time Stamp: ${Date.now()}`
  )
}

async function validateUserId(req, res, next) {
  const id = req.params.id
  const user = await User.getById(id)
  if(!user){
    res.status(404).json({
      message: "user not found"
    })
  } else {
    req.user = user
    next()
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const name  = req.body.name
  if (!name) {
    res.status(400).json({ message: 'missing required name field' })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const  text  = req.body.text
  if (!text) {
    res.status(400).json({ message: 'missing required text field' })
  } else {
    next()
  }
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
    custom: "It's not working."
  })
}


// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUser,
  validateUserId,
  validatePost,
  errorHandler
}