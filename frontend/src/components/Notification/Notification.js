import React from "react"
import styles from "./Notifications.module.scss"

const Notification = ({ message, error }) => {
  if (message === null && error === null) {
    return null
  }

  return (
    <div className={styles.notifications}>
      <div className={styles.error}>{error}</div>
      <div className={styles.message}>{message}</div>
    </div>
  )
}

export default Notification
