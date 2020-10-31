import React from "react"
import styles from "./Notifications.module.scss"

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className={styles.error}>{message}</div>
}

export default Notification
