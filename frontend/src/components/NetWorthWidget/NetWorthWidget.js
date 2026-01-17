import React, { useState } from "react"
import plaidService from "../../services/plaid"
import { NumericFormat } from "react-number-format"

const NetWorthWidget = ({ user }) => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchBalances = async () => {
    try {
      setLoading(true)
      setError(null)
      plaidService.setToken(user.token)
      const data = await plaidService.getBalance()
      setAccounts(data.accounts)
      setHasFetched(true)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching balances:", err)
      if (
        err.response?.status === 400 &&
        err.response?.data?.error === "Plaid not linked"
      ) {
        setError(
          "No bank accounts linked yet. Use the button above to link your account."
        )
      } else {
        setError(
          "Unable to fetch account balances. Plaid may not be configured."
        )
      }
      setHasFetched(true)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading account data...</div>
  if (error) return <div className="error">{error}</div>

  if (!hasFetched) {
    return (
      <div className="net-worth-widget">
        <p>Click the button below to fetch your linked account balances.</p>
        <button onClick={fetchBalances} className="refresh-button">
          Fetch Balances
        </button>
      </div>
    )
  }

  const totalNetWorth = accounts.reduce(
    (acc, account) => acc + account.balances.current,
    0
  )

  return (
    <div className="net-worth-widget">
      <h3>Net Worth</h3>
      <div className="net-worth-value">
        <NumericFormat
          value={totalNetWorth}
          displayType={"text"}
          prefix={"$"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
        />
      </div>
      <div className="accounts-list">
        {accounts.map((account) => (
          <div key={account.account_id} className="account-item">
            <span>{account.name}</span>
            <span>
              <NumericFormat
                value={account.balances.current}
                displayType={"text"}
                prefix={"$"}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
              />
            </span>
          </div>
        ))}
      </div>
      <button onClick={fetchBalances} className="refresh-button">
        Refresh
      </button>
    </div>
  )
}

export default NetWorthWidget
