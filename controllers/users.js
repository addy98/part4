const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  if (request.body.name == undefined) {
    response.status(400).send('user must have name')
  } else if (request.body.username == undefined) {
    response.status(400).send('user must have username')
  } else if (request.body.name.length < 3) {
    response.status(400).send('name of user must be at least 3 characters long')
  } else if (request.body.username.length < 3) {
    response.status(400).send('username of user must be at least 3 characters long')
  } else {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  }
})

module.exports = usersRouter