import React, { useState, useEffect } from "react"
import Budget from "./components/Budget"
import BudgetForm from "./components/BudgetForm"
import LoginForm from "./components/LoginForm"
import NumberFormat from "react-number-format"
import PieChart from "./components/PieChart"
import * as d3 from "d3"
import * as d3arr from "d3-array"
import budgetService from "./services/budget"
import loginService from "./services/login"

function App() {
  const [budget, setBudget] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  //set budget to initial budget from DB
  // useEffect(() => {
  //   budgetService.getAll().then((initialBudget) => {
  //     setBudget(initialBudget)
  //   })
  // }, [])

  //TODO: handlelogin and check if user logged in at start

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem("loggedbudgetappUser", JSON.stringify(user))

      budgetService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setErrorMessage("wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
    />
  )

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedbudgetappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      budgetService.setToken(user.token)
    }
  }, [])

  const createBudgetItem = (budgetItem) => {
    //create budget item and add to database
    budgetService.create(budgetItem).then((returnedItem) => {
      setBudget(budget.concat(returnedItem))
    })
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

  //Total for each expense type
  //TODO: Add Savings to expense chart
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
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <BudgetForm createBudgetItem={createBudgetItem} />
        </div>
      )}
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
        width={400}
        height={400}
        innerRadius={60}
        outerRadius={100}
      />
    </div>
  )
}

export default App
