const goalsRouter = require("express").Router()
const Goal = require("../models/goal")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = (request) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

const getYearMonth = () => {
  const dateObj = new Date()
  const month = dateObj.getUTCMonth()
  const year = dateObj.getUTCFullYear()
  const yearMonth = year + "/" + month

  return yearMonth
}

//TODO: get request for retreiving spending goals
goalsRouter.get("/", async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const yearMonth = getYearMonth()

  const loggedUser = await User.findById(decodedToken.id)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid"})
  }

  const goals = await Goal.find({ user: loggedUser, date: yearMonth }).populate('user', { username: 1, name: 1 })
  response.json(goals.map((goal) => goal.toJSON()))
})

//TODO: post request to create new spending goal
goalsRouter.post("/", async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const yearMonth = getYearMonth()

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid"})
  }

  const user = await User.findById(decodedToken.id)

  const goal = new Goal({
    category: body.category,
    total: body.total,
    maxGoal: body.maxGoal,
    percentTowardsGoal: body.percentTowardsGoal,
    date: yearMonth,
    user: user._id
  })

  const savedGoal = await goal.save()

  response.json(savedGoal.toJSON())
})

//TODO: delete request to remove spending goal
goalsRouter.delete("/:id", async (request, response, next) => {
  await Goal.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = goalsRouter