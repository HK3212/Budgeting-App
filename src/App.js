import React, { useState, useEffect } from "react"
import Budget from "./components/Budget"
import BudgetForm from "./components/BudgetForm"

function App() {
  const [budget, setBudget] = useState([])

  useEffect(() => {
    console.log(budget)
  }, [budget])

  const createBudgetItem = (budgetItem) => {
    //create budget item and add to database
    setBudget(budget.concat(budgetItem))
  }

  const incomeValues = budget.map((budgetItem) => {
    if (budgetItem.value >= 0) {
      return parseInt(budgetItem.value)
    } else {
      return 0
    }
  })

  const expenseValues = budget.map((budgetItem) => {
    if (budgetItem.value < 0) {
      return parseInt(budgetItem.value)
    } else {
      return 0
    }
  })

  const totalIncome = incomeValues.reduce((a, b) => a + b, 0)

  const totalExpenses = -1 * expenseValues.reduce((a, b) => a + b, 0)

  const savings = totalIncome - totalExpenses

  console.log(incomeValues, expenseValues)
  console.log(totalIncome, totalExpenses)

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
        <span>Total Income: {totalIncome}</span>
        <br></br>
        <span>Total Expenses: {totalExpenses}</span>
        <br></br>
        <span>Savings: {savings}</span>
      </div>
    </div>
  )
}

export default App
