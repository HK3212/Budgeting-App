import React, { useState } from "react"
import Dropdown from "./Dropdown"

const NewAmount = () => {
  const [newAmount, setNewAmount] = useState("")

  const handleChange = (event) => {
    setNewAmount(event.target.value)
  }

  const addAmount = async (event) => {
    event.preventDefault()
    //const content = event.target.amount.value
    //event.target.amount.value = ''
  }

  return (
    <form style={{ display: "flex" }} onSubmit={addAmount}>
      <Dropdown />
      <input name="description" />
      <input name="amount" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewAmount
