import React, { useCallback, useEffect, useState } from "react"
import { usePlaidLink } from "react-plaid-link"
import plaidService from "../../services/plaid"

const LinkAccount = ({ user, onAccountLinked }) => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const createToken = async () => {
      plaidService.setToken(user.token)
      const data = await plaidService.createLinkToken()
      setToken(data.link_token)
    }
    createToken()
  }, [user])

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

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="plaid-link-button"
    >
      Link Bank Account
    </button>
  )
}

export default LinkAccount
