import React, { useCallback, useState } from "react"
import { usePlaidLink } from "react-plaid-link"
import plaidService from "../../services/plaid"

const LinkAccount = ({ user, onAccountLinked }) => {
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const initializePlaid = async () => {
    try {
      setLoading(true)
      setError(null)
      plaidService.setToken(user.token)
      const data = await plaidService.createLinkToken()
      setToken(data.link_token)
      setLoading(false)
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to connect to Plaid"
      setError(errorMsg)
      setLoading(false)
    }
  }

  const onSuccess = useCallback(
    async (public_token, metadata) => {
      await plaidService.setAccessToken(public_token)
      if (onAccountLinked) {
        onAccountLinked()
      }
    },
    [onAccountLinked]
  )

  const config = {
    token,
    onSuccess,
  }

  const { open, ready } = usePlaidLink(config)

  // Open Plaid Link when token is ready
  React.useEffect(() => {
    if (token && ready) {
      open()
    }
  }, [token, ready, open])

  if (error) {
    return (
      <div className="plaid-error">
        <p>Plaid integration is not configured.</p>
        <p>
          To link bank accounts, add your Plaid API credentials to the backend
          .env file.
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={initializePlaid}
      disabled={loading}
      className="plaid-link-button"
    >
      {loading ? "Connecting..." : "Link Bank Account"}
    </button>
  )
}

export default LinkAccount
