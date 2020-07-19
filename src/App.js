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

  return (
    <div className="App">
      <BudgetForm createBudgetItem={createBudgetItem} />
      {budget.map((budgetItem, i) => (
        <Budget key={i} budget={budgetItem} />
      ))}
    </div>
  )
}

export default App
