//TODO: POST request for saving new user to DB
const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.post("/", async (request, response) => {
  const body = request.body
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.newPass, saltRounds)

  const user = new User({
    username: body.newUser,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

//TODO: GET request for retreiving users
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("budget", { type: 1, value: 1 })
  response.json(users.map((u) => u.toJSON()))
})

module.exports = usersRouter