const mongoose = require("mongoose")

mongoose.set("useFindAndModify", false)

const budgetItemSchema = new mongoose.Schema({
  isIncome: Boolean,
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  value: {
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
  },
})

budgetItemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    console.log(document)
  },
})

module.exports = mongoose.model("budgetItem", budgetItemSchema)