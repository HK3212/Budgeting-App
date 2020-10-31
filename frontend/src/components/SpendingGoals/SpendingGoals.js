import React, { useState } from "react"
import NumberFormat from "react-number-format"
import Notification from "../Notification/Notification"
import { groupedGoalsOptions } from "../../data/options"
import Select from "react-select"
import styles from "./SpendingGoals.module.scss"

const SpendingGoals = ({ totalPerType, totalExpenses }) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [goals, setGoals] = useState([])
  const [maxValue, setMaxValue] = useState("")
  const [selectedOption, setSelectedOption] = useState("")

  const handleOption = (event) => {
    setSelectedOption(event.label)
  }

  const handleMaxValue = (event) => {
    setMaxValue(event.target.value)
  }

  const addSpendingGoal = (event) => {
    event.preventDefault()

    // if ((selectedOption = "Monthly Total")) {
    //   const totalByCategory = totalExpenses
    // } else {
    //   const totalByCategory = totalPerType.find(
    //     (expense) => expense.type === selectedOption
    //   ).type
    // }
    try {
      const totalByCategory = totalPerType.find(
        (expense) => expense.type === selectedOption
      ).value

      if ((selectedOption = "Monthly Total")) {
        const newGoal = {
          type: selectedOption,
          total: totalByCategory,
          maxGoal: maxValue,
        }
      } else {
        const newGoal = {
          type: selectedOption,
          total: totalExpenses,
          maxGoal: maxValue,
        }
      }
    } catch (exception) {
      setErrorMessage("No budget entries for " + selectedOption)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  //setMaxValue("")

  //TODO: Add Spending Goal to Database

  const getMonth = (index) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[index]
  }

  //Styling for dropdown
  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const date = new Date()
  const currMonth = getMonth(date.getMonth())

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span>{data.options.length}</span>
    </div>
  )

  return (
    <div className={styles.goals}>
      <Notification message={errorMessage} />
      <h1 className={styles.title}>Spending Goals</h1>
      <h2 className={styles.currMonth}>
        {currMonth + " " + date.getFullYear()}
      </h2>
      <h4>
        Enter a maximum spending amount for your total monthly budget or a
        specific category.
      </h4>
      <form className={styles.form} onSubmit={addSpendingGoal}>
        <div style={{ width: "200px" }}>
          <Select
            onChange={handleOption}
            formatGroupLabel={formatGroupLabel}
            options={groupedGoalsOptions}
            placeholder="Category"
          />
        </div>
        <input
          type="string"
          placeholder="Max Value"
          value={maxValue}
          onChange={handleMaxValue}
          className={styles.forminput}
        />
        <button type="submit" className={styles.btn}>
          add
        </button>
      </form>
    </div>
  )
}

export default SpendingGoals
