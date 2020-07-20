import React from "react"

//Display budget entries, negative values for expenses

const Budget = ({ budget }) => {
  return (
    <div>
      <span className="budgetItem">{budget.type}</span>
      <span className="budgetItem">{budget.description}</span>
      <span className="budgetItem">{budget.value}</span>
    </div>
  )
}

export default Budget
