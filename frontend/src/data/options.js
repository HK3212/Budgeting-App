//Income and expense options

export const incomeOptions = [
  { value: "employment", label: "Employment" },
  { value: "commerce", label: "Commerce" },
  { value: "dividends", label: "Dividends" },
  { value: "stocks", label: "Stocks" },
  { value: "return", label: "Tax Return" },
]

export const expenseOptions = [
  { value: "groceries", label: "Groceries" },
  { value: "dining", label: "Dining" },
  { value: "transportation", label: "Transportation" },
  { value: "housing", label: "Housing" },
  { value: "utilities", label: "Utilities" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "clothing", label: "Clothing" },
  { value: "health", label: "Health" },
  { value: "debt", label: "Debt" },
  { value: "investment", label: "Investment" },
  { value: "insurance", label: "Insurance" },
  { value: "personal", label: "Personal" },
]

export const goalsOptions = [{ value: "total", label: "Monthly Total" }]

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

export const groupedGoalsOptions = [
  {
    label: "Total",
    options: goalsOptions,
  },
  {
    label: "Expenses",
    options: expenseOptions,
  },
]

export default groupedOptions
