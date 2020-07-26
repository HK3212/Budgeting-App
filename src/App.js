import React, { useState, useEffect } from "react"
import Budget from "./components/Budget"
import BudgetForm from "./components/BudgetForm"
import NumberFormat from "react-number-format"
import PieChart from "./components/PieChart"
import * as d3 from "d3"
import * as d3arr from "d3-array"

function App() {
  const [budget, setBudget] = useState([])

  const createBudgetItem = (budgetItem) => {
    //create budget item and add to database
    setBudget(budget.concat(budgetItem))
  }

  const incomeItems = budget
    .map((budgetItem) => {
      if (budgetItem.isIncome === true) {
        return budgetItem
      } else {
        return 0
      }
    })
    .filter((incomeItem) => incomeItem.type !== undefined)

  const incomeValues = incomeItems.map((budgetItem) => {
    return parseInt(budgetItem.value)
  })

  const expenseItems = budget
    .map((budgetItem) => {
      if (budgetItem.isIncome === false) {
        return budgetItem
      } else {
        return 0
      }
    })
    .filter((expenseItem) => expenseItem.type !== undefined)

  const expenseValues = expenseItems.map((budgetItem) => {
    return parseInt(budgetItem.value)
  })

  const totalIncome = incomeValues.reduce((a, b) => a + b, 0)

  const totalExpenses = expenseValues.reduce((a, b) => a + b, 0)

  const savings = totalIncome - totalExpenses

  const totalPerType = d3arr
    .rollups(
      expenseItems,
      (val) => d3.sum(val, (budgetItem) => budgetItem.value),
      (d) => d.type
    )
    .map(([type, value]) => ({ type: type, value: value }))

  useEffect(() => {
    console.log(totalPerType)
  }, [totalPerType])

  return (
    <div className="App">
      <div className="BudgetForm">
        <BudgetForm createBudgetItem={createBudgetItem} />
      </div>
      <div className="budgetItems">
        {budget.map((budgetItem, i) => (
          <Budget key={i} budget={budgetItem} />
        ))}
      </div>
      <div className="BudgetTotals">
        <span>
          Total Income:
          <NumberFormat
            value={totalIncome}
            displayType={"text"}
            prefix={"$"}
            thousandSeparator={true}
          />
        </span>
        <br></br>
        <span>
          Total Expenses:
          <NumberFormat
            value={totalExpenses}
            displayType={"text"}
            prefix={"$"}
            thousandSeparator={true}
          />
        </span>
        <br></br>
        <span>
          Savings:
          <NumberFormat
            value={savings}
            displayType={"text"}
            prefix={"$"}
            thousandSeparator={true}
          />
        </span>
      </div>
      <PieChart
        data={totalPerType}
        width={200}
        height={200}
        innerRadius={60}
        outerRadius={100}
      />
    </div>
  )
}

export default App
