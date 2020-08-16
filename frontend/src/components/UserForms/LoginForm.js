//TODO: Add login/register form
import React from "react"
import PropTypes from "prop-types"
import styles from "./UserForms.module.scss"

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  switchForm,
}) => {
  return (
    <div className={styles.userform}>
      <h2>Budget Tracker</h2>

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
        <button type="submit" className={styles.btn}>
          Login
        </button>
        <div className={styles.divbtn} />
        <button onClick={switchForm} type="switch" className={styles.btn}>
          Register
        </button>
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
