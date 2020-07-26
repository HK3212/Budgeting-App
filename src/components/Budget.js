import React from "react"
import NumberFormat from "react-number-format"

//Display budget entries, negative values for expenses

const Budget = ({ budget }) => {
  return (
    <div>
      <span className="budgetItem">{budget.type}</span>
      <span className="budgetItem">{budget.description}</span>
      <NumberFormat
        value={budget.value}
        displayType={"text"}
        prefix={"$"}
        thousandSeparator={true}
      />
    </div>
  )
}

export default Budget
