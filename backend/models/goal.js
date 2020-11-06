const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

mongoose.set("useFindAndModify", false)

const goalSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: false,
  },
  maxGoal: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: false,
  }
})

goalSchema.index({ user: 1, category: 1 }, { unique: true })

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
