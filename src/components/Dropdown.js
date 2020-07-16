import React from "react"
import Select from "react-select"

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
  { value: "helath", label: "Health" },
]

export const groupedOptions = [
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

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span>{data.options.length}</span>
  </div>
)

export default () => (
  <div style={{ width: "200px" }}>
    <Select
      defaultValue={incomeOptions[1]}
      options={groupedOptions}
      formatGroupLabel={formatGroupLabel}
    />
  </div>
)
