const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

mongoose.set("useFindAndModify", false)

const goalSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  total: {
    type: Number,
    required: true,
  },
  maxGoal: {
    type: Number,
    required: true,
  },
  percentTowardsGoal: {
    type: Number,
  },
  date: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
})

goalSchema.plugin(uniqueValidator)

goalSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    console.log(document)
  },
})

module.exports = mongoose.model("goal", goalSchema)