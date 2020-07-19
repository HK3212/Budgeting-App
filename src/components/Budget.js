import React from "react"
import { incomeOptions, expenseOptions } from "../data/options"

//Display budget entries, negative values for expenses

const Budget = ({ budget }) => {
  return (
    <div className="budgetItem">
      <span>{budget.type}</span>
      <span>{budget.description}</span>
      <span>{budget.value}</span>
    </div>
  )
}

export default Budget
