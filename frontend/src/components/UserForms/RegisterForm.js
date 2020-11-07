//TODO: Add register form
import React, { useState } from "react"
import userService from "../../services/user"
import Notification from "../Notification/Notification"
import PropTypes from "prop-types"
import styles from "./UserForms.module.scss"

const RegisterForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  switchForm,
}) => {
  const [newUser, setNewUser] = useState("")
  const [newPass, setNewPass] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [message, setMessage] = useState("")

  const handleUser = (event) => {
    setNewUser(event.target.value)
  }

  const handlePass = (event) => {
    setNewPass(event.target.value)
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    try {
      if (newUser === "" || newPass === "") {
        throw "username or password field is empty"
      }
      const user = await userService.register({
        newUser,
        newPass,
      })
      setMessage(newUser + " has successfully registered!")
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setNewUser("")
      setNewPass("")
      //return Error notif if user is already taken
    } catch (exception) {
      setErrorMessage(exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  return (
    <div className={styles.userform}>
      <Notification error={errorMessage} message={message} />
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <input
            placeholder="Username"
            className={styles.input}
            value={newUser}
            onChange={handleUser}
            minLength="4"
          />
        </div>
        <div className={styles.divbtn} />
        <div>
          <input
            placeholder="Password"
            className={styles.input}
            type="password"
            value={newPass}
            onChange={handlePass}
            minLength="4"
          />
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.btn} id="register-button">
            Register
          </button>
          <div className={styles.divbtn} />
          <button
            onClick={switchForm}
            className={styles.btn}
            type="switch"
            id="switch-button"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  )
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default RegisterForm
