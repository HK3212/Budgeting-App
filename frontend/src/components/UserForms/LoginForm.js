//TODO: Add login/register form
import React from "react"
import PropTypes from "prop-types"
import styles from "./UserForms.module.scss"
import Notification from "../Notification/Notification"

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  switchForm,
  message,
}) => {
  return (
    <div className={styles.userform}>
      <Notification error={message} message={null} />
      <h2 className={styles.title}>Budget Tracker</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            id="username"
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
        <div className={styles.buttons}>
          <button type="submit" className={styles.btn}>
            Login
          </button>
          <div className={styles.divbtn} />
          <button onClick={switchForm} type="switch" className={styles.btn}>
            Register
          </button>
        </div>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
