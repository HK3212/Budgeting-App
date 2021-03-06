const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")

const config = require("./utils/config")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")

const budgetRouter = require("./controllers/budget")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const goalsRouter = require("./controllers/goals")

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoIndex: true,
})
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connection to MongoDB: ", error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static("build"))
app.use(middleware.requestLogger)

app.use("/api/budget", budgetRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
app.use("/api/goals", goalsRouter)

// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app