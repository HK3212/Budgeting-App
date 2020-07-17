import React, { useState, useEffect } from "react"
import groupedOptions from "../data/options"
import Select from "react-select"

const NewBudgetItem = ({ createBudgetItem }) => {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [selectedOption, setSelectedOption] = useState("")

  //Using for console log after new renders
  useEffect(() => {
    console.log(selectedOption)
    console.log(amount)
    console.log(description)
  }, [amount, description, selectedOption])

  const handleAmount = (event) => {
    setAmount(event.target.value)
    console.log(amount)
  }

  const handleDescription = (event) => {
    setDescription(event.target.value)
    console.log(description)
  }

  const handleOption = (event) => {
    setSelectedOption(event.value)
    //console.log(selectedOption)
  }

  const addBudgetItem = (event) => {
    event.preventDefault()
    //created item based on schema
    // createBudgetItem({
    //   type: selectedOption,
    //   description: description,
    //   value: amount,
    // })
  }

  //Styling for dropdown
  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span>{data.options.length}</span>
    </div>
  )

  return (
    <form style={{ display: "flex" }} onSubmit={addBudgetItem}>
      <div style={{ width: "200px" }}>
        <Select
          onChange={handleOption}
          options={groupedOptions}
          formatGroupLabel={formatGroupLabel}
        />
      </div>
      <input type="string" value={description} onChange={handleDescription} />
      <input type="number" value={amount} onChange={handleAmount} />
      <button type="submit">add</button>
    </form>
  )
}

export default NewBudgetItem
