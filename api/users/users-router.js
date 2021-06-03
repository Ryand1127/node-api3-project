const express = require('express');
const User = require('./users-model');
const Post = require('../posts/posts-model');

const {
  validateUser,
  validatePost,
  validateUserId,
} = require('./../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();


router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
  .then(users => res.json(users))
  .catch(err => next(err))
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert(req.body)
  .then(({id}) => {
    return User.getById(id)
  })
  .then(user => res.status(201).json(user))
  .catch(err => next(err))
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  const id = req.params.id
  const body = req.body
  User.getById(id)
    .then(() => {
      return User.update(id, body)
    })
    .then(() => {
      return User.getById(id)
    })
    .then(user => res.json(user))
    .catch(err => next(err))
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    const id = req.params.id
    const userId = await User.getById(id)
      if(userId) {
        await User.remove(id)
        res.json(userId)
        next()
      }
  } catch(err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params

  User.getUserPosts(id)
  .then(posts => res.json(posts))
  .catch(err => next(err))

});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postInfo = { ...req.body, user_id: req.params.id}
  Post.insert(postInfo)
    .then(post => res.status(201).json(post))
    .catch(err => next(err))
});

router.use((err, req, res, next) => { //eslint-disable-line
  res.status(500).json({
    message: "Something died.",
    error: err.message
  });
});

module.exports = router;
// do not forget to export the router
