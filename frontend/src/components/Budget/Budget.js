import React from "react"
import NumberFormat from "react-number-format"
import styles from "./Budget.module.scss"
import budgetService from "../../services/budget"

//Display budget entries, negative values for expenses

const Budget = ({ budget, removeBudgetItem }) => {
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

  //add onClick function for handling delete (get id from budgetItem.id)

  const date = new Date()
  const currMonth = getMonth(date.getMonth())
  return (
    <div className={styles.budget}>
      <h2>{currMonth + " " + date.getFullYear()}</h2>
      <table className={styles.budgetItems}>
        <thead>
          <tr>
            <th align="left">Category</th>
            <th align="left">Description</th>
            <th align="right">Amount</th>
          </tr>
        </thead>
        {budget.map((budgetItem, i) => (
          <tbody>
            <tr>
              <td className={styles.type}>{budgetItem.type}</td>
              <td className={styles.description}>{budgetItem.description}</td>
              {budgetItem.isIncome === true ? (
                <td className={styles.income}>
                  <NumberFormat
                    value={budgetItem.value}
                    displayType={"text"}
                    prefix={"$"}
                    thousandSeparator={true}
                  />
                </td>
              ) : (
                <td className={styles.expense}>
                  <NumberFormat
                    value={budgetItem.value}
                    displayType={"text"}
                    prefix={"$"}
                    thousandSeparator={true}
                  />
                </td>
              )}
              <td className={styles.options}>
                <button className={styles.update}>Update</button>
                <button
                  className={styles.delete}
                  onClick={() => removeBudgetItem(budgetItem.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  )
}

export default Budget
