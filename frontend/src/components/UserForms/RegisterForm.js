//TODO: Add register form
import React from "react"
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
  return (
    <div className={styles.userform}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className={styles.divbtn} />
        <div>
          <input
            placeholder="Password"
            className={styles.input}
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
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
