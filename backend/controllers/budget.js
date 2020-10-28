const budgetRouter = require("express").Router()
const BudgetItem = require("../models/budgetItem")
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

//get request to retrieve budget items

budgetRouter.get("/", async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const loggedUser = await User.findById(decodedToken.id)
  const yearMonth = getYearMonth()

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid"})
  }

  const budget = await BudgetItem.find({ user: loggedUser, date: yearMonth }).populate('user', { username: 1, name: 1 })
  response.json(budget.map((budgetItem) => budgetItem.toJSON()))
})

//post request to save new budget item
budgetRouter.post("/", async (request, response, next) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const yearMonth = getYearMonth()

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid"})
  }

  const user = await User.findById(decodedToken.id)

  const budgetItem = new BudgetItem({
    type: body.type,
    description: body.description,
    isIncome: body.isIncome,
    value: body.value,
    date: yearMonth,
    user: user._id
  })

  const savedBudgetItem = await budgetItem.save()
  user.budget = user.budget.concat(savedBudgetItem._id)
  await user.save()

  response.json(savedBudgetItem.toJSON())
})

//TODO: delete request to remove budget item
budgetRouter.delete("/:id", async (request, response, next) => {
  await BudgetItem.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//TODO: put request to update budget item

module.exports = budgetRouter