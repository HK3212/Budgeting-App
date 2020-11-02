import React, { useState, useEffect } from "react"
import Notification from "../Notification/Notification"
import { groupedGoalsOptions } from "../../data/options"
import Select from "react-select"
import styles from "./SpendingGoals.module.scss"
import goalsService from "../../services/goals"

const SpendingGoals = ({
  totalPerType,
  totalExpenses,
  currMonth,
  currYear,
}) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [goals, setGoals] = useState([])
  const [maxValue, setMaxValue] = useState("")
  const [selectedOption, setSelectedOption] = useState("")

  useEffect(() => {
    //set spending goals to initial goals from DB
    goalsService.getAll().then((initialGoals) => {
      setGoals(initialGoals)
    })
  }, [])

  const handleOption = (event) => {
    setSelectedOption(event.label)
  }

  const handleMaxValue = (event) => {
    setMaxValue(event.target.value)
  }

  const addSpendingGoal = (event) => {
    event.preventDefault()
    try {
      //Check if there are any budget entries for category
      if (selectedOption !== "Monthly Total") {
        totalPerType.find((expense) => expense.type === selectedOption)
      }

      const newGoal = {
        category: selectedOption,
        maxGoal: maxValue,
      }
      goalsService.create(newGoal).then((returnedItem) => {
        setGoals(goals.concat(returnedItem))
      })
    } catch (exception) {
      if (selectedOption === "") {
        setErrorMessage("Please select a category")
      } else {
        setErrorMessage("No budget entries for " + selectedOption)
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
    setMaxValue("")
  }

  const removeGoal = (id) => {
    goalsService.remove(id).then(() => {
      setGoals(goals.filter((goalItem) => goalItem.id !== id))
    })
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
    <div className={styles.goalsPage}>
      <div className={styles.headings}>
        <Notification message={errorMessage} />
        <h1 className={styles.title}>Spending Goals</h1>
        <h2 className={styles.currMonth}>{currMonth + " " + currYear}</h2>
        <h4>
          Enter a maximum spending amount for your total monthly budget or a
          specific category.
        </h4>
      </div>
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
      <div className={styles.goals}>
        {goals.map((goalItem, i) => {
          var totalByCategory = ""
          var barColor = ""

          if (goalItem.category === "Monthly Total") {
            totalByCategory = totalExpenses
          } else {
            totalByCategory = totalPerType.find(
              (expense) => expense.type === goalItem.category
            ).value
          }

          const percentTowardsGoal = (totalByCategory / goalItem.maxGoal) * 100

          //set barColor based on percent
          if (percentTowardsGoal <= 66) {
            //green
            barColor = "#09c674"
          } else if (percentTowardsGoal > 66 && percentTowardsGoal < 80) {
            //yellow
            barColor = "#aca909"
          } else if (percentTowardsGoal >= 80) {
            //red
            barColor = "#EC0B4F"
          }

          return (
            <div className={styles.goalItem}>
              <div className={styles.goalLabels}>
                <span className={styles.category}>{goalItem.category}</span>
                <span className={styles.remainder}>
                  ${goalItem.maxGoal - totalByCategory} left
                </span>
              </div>
              <div
                className={styles.progressbar}
                style={{
                  "--width": percentTowardsGoal,
                  "--bar-color": barColor,
                }}
                data-label={
                  "$" + totalByCategory + " out of $" + goalItem.maxGoal
                }
              ></div>
              <button
                className={styles.delete}
                onClick={() => removeGoal(goalItem.id)}
              >
                Delete
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SpendingGoals
