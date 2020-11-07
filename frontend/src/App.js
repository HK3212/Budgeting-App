import React, { useState, useEffect } from "react"
import "./App.scss"
import Budget from "./components/Budget/Budget"
import BudgetForm from "./components/BudgetForm/BudgetForm"
import LoginForm from "./components/UserForms/LoginForm"
import RegisterForm from "./components/UserForms/RegisterForm"
import NumberFormat from "react-number-format"
import PieChart from "./components/PieChart/PieChart"
import SpendingGoals from "./components/SpendingGoals/SpendingGoals"
import Notification from "./components/Notification/Notification"
import * as d3 from "d3"
import * as d3arr from "d3-array"
import budgetService from "./services/budget"
import loginService from "./services/login"
import userService from "./services/user"
import goalsService from "./services/goals"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

function App() {
  const [budget, setBudget] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [switchForm, setSwitchForm] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedbudgetappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      budgetService.setToken(user.token)
      goalsService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    //set budget to initial budget from DB if user is logged in
    if (user !== null) {
      budgetService.setToken(user.token)
      goalsService.setToken(user.token)
      budgetService.getAll().then((initialBudget) => {
        setBudget(initialBudget)
      })
    }
  }, [user])

  //check if user logged in at start
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem("loggedbudgetappUser", JSON.stringify(user))

      budgetService.setToken(user.token)
      goalsService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setErrorMessage("wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    localStorage.removeItem("loggedbudgetappUser")
    setUser(null)
    setBudget([])
  }

  const userForm = () => {
    if (!switchForm) {
      return (
        <div className="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
            switchForm={() => setSwitchForm(!switchForm)}
            message={errorMessage}
          />
        </div>
      )
    } else {
      return <RegisterForm switchForm={() => setSwitchForm(!switchForm)} />
    }
  }

  const createBudgetItem = (budgetItem) => {
    //create budget item and add to database
    budgetService.create(budgetItem).then((returnedItem) => {
      setBudget(budget.concat(returnedItem))
    })
  }

  const removeBudgetItem = (id) => {
    budgetService.remove(id).then(() => {
      setBudget(budget.filter((budgetItem) => budgetItem.id !== id))
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

  var savingsClass = ""

  if (savings >= 0) {
    savingsClass = "positive"
  } else {
    savingsClass = "negative"
  }

  //Total for each expense type
  //TODO: Add Savings to expense chart
  const totalPerType = d3arr
    .rollups(
      expenseItems,
      (val) => d3.sum(val, (budgetItem) => budgetItem.value),
      (d) => d.type
    )
    .map(([type, value]) => ({ type: type, value: value }))

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
  const currYear = date.getFullYear()

  return (
    <div className="App">
      {user === null ? (
        userForm()
      ) : (
        <Router>
          <div className="navbar">
            <div className="leftnav">
              <Link className="navitem" to="/">
                Budget
              </Link>
              <Link className="navitem" to="/goals">
                Goals
              </Link>
            </div>
            <div className="rightnav">
              {user.username} logged in
              <Link className="navitem" onClick={handleLogout}>
                Log out
              </Link>
            </div>
          </div>
          <Switch>
            <Route path="/goals">
              <SpendingGoals
                totalPerType={totalPerType}
                totalExpenses={totalExpenses}
                currMonth={currMonth}
                currYear={currYear}
              />
            </Route>
            <Route path="/">
              <div className="budget">
                <h1 className="title">Monthly Budget</h1>
                <h2 className="currMonth">{currMonth + " " + currYear}</h2>
                <BudgetForm createBudgetItem={createBudgetItem} />
                <div className="budgetItems">
                  <Budget budget={budget} removeBudgetItem={removeBudgetItem} />
                </div>
                <div className="budgetTotals">
                  <span>
                    Total Income:
                    <NumberFormat
                      className="positive"
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
                      className="negative"
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
                      className={savingsClass}
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
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  )
}

export default App
