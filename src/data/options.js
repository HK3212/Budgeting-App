//Income and expense options

const incomeOptions = [
  { value: "employment", label: "Employment" },
  { value: "commerce", label: "Commerce" },
  { value: "dividends", label: "Dividends" },
  { value: "stocks", label: "Stocks" },
  { value: "return", label: "Tax Return" },
]

const expenseOptions = [
  { value: "groceries", label: "Groceries" },
  { value: "dining", label: "Dining" },
  { value: "transportation", label: "Transportation" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "clothing", label: "Clothing" },
  { value: "travel", label: "Travel" },
  { value: "health", label: "Health" },
]

const groupedOptions = [
  {
    label: "Income",
    options: incomeOptions,
    color: "green",
  },
  {
    label: "Expenses",
    options: expenseOptions,
  },
]

export default groupedOptions
