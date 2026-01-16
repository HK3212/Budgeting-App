import React, { useEffect, useState } from "react"
import plaidService from "../../services/plaid"
import { NumericFormat } from "react-number-format"

const NetWorthWidget = ({ user }) => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBalances = async () => {
    try {
      setLoading(true)
      plaidService.setToken(user.token)
      const data = await plaidService.getBalance()
      setAccounts(data.accounts)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching balances:", err)
      setError("Failed to fetch account balances. Please link your account.")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBalances()
    }
  }, [user])

  if (loading) return <div>Loading account data...</div>
  if (error) return <div className="error">{error}</div>

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
