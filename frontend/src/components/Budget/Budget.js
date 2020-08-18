import React from "react"
import NumberFormat from "react-number-format"
import styles from "./Budget.module.scss"

//Display budget entries, negative values for expenses

const Budget = ({ budget }) => {
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
            <th align="left">Amount</th>
          </tr>
        </thead>
        {budget.map((budgetItem, i) => (
          <tbody>
            <tr>
              <td>{budgetItem.type}</td>
              <td>{budgetItem.description}</td>
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
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  )
}

export default Budget
