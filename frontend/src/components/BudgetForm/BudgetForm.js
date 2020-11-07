import React, { useState } from "react"
import Notification from "../Notification/Notification"
import groupedOptions, { expenseOptions } from "../../data/options"
import Select from "react-select"
import styles from "./BudgetForm.module.scss"

const BudgetForm = ({ createBudgetItem }) => {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [message, setMessage] = useState("")

  const handleAmount = (event) => {
    setAmount(event.target.value)
  }

  const handleDescription = (event) => {
    setDescription(event.target.value)
  }

  const handleOption = (event) => {
    setSelectedOption(event.label)
  }

  const addBudgetItem = (event) => {
    event.preventDefault()
    try {
      var msg = ""
      if (amount === "") {
        msg = msg + "Please enter an amount \n"
      }
      if (description === "") {
        msg = msg + "Please enter a description \n"
      }
      if (selectedOption === "") {
        msg = msg + "Please select a category"
      }
      if (msg !== "") {
        throw msg
      }
      if (
        expenseOptions.some((checkType) => checkType.label === selectedOption)
      ) {
        createBudgetItem({
          isIncome: false,
          type: selectedOption,
          description: description,
          value: amount,
        })
      } else {
        createBudgetItem({
          isIncome: true,
          type: selectedOption,
          description: description,
          value: amount,
        })
      }
      setMessage("Budget entry has been added!")
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage(exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }

    setAmount("")
    setDescription("")
  }

  //setSelectedOption("")

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
    <div className={styles.budgetForm}>
      <Notification error={errorMessage} message={message} />
      <form className={styles.form} onSubmit={addBudgetItem}>
        <div style={{ width: "200px" }}>
          <Select
            onChange={handleOption}
            options={groupedOptions}
            formatGroupLabel={formatGroupLabel}
            placeholder="Category"
          />
        </div>
        <input
          type="string"
          placeholder="Description"
          value={description}
          onChange={handleDescription}
          className={styles.forminput}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={handleAmount}
          className={styles.forminput}
        />
        <button type="submit" className={styles.btn}>
          add
        </button>
      </form>
    </div>
  )
}

export default BudgetForm
