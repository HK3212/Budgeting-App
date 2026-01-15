import React from "react"
import { NumericFormat } from "react-number-format"
import styles from "./Budget.module.scss"

//Display budget entries, negative values for expenses

const Budget = ({ budget, removeBudgetItem }) => {
  return (
    <div className={styles.budget}>
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
                  <NumericFormat
                    value={budgetItem.value}
                    displayType={"text"}
                    prefix={"$"}
                    thousandSeparator={true}
                  />
                </td>
              ) : (
                <td className={styles.expense}>
                  <NumericFormat
                    value={budgetItem.value}
                    displayType={"text"}
                    prefix={"$"}
                    thousandSeparator={true}
                  />
                </td>
              )}
              <td className={styles.options}>
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
