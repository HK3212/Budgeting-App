import React from "react"
import NewBudgetItem from "./components/NewBudgetItem"

function App() {
  const createBudgetItem = () => {
    //create budget item and add to database
  }

  return (
    <div className="App">
      <NewBudgetItem createBudgetItem={createBudgetItem} />
    </div>
  )
}

export default App
