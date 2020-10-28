import React, { useEffect, useRef } from "react"
import styles from "./PieChart.module.scss"
import * as d3 from "d3"

const PieChart = (props) => {
  const ref = useRef(null)
  const createPie = d3
    .pie()
    .value((d) => d.value)
    .sort(null)
  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius)
  const colors = d3.scaleOrdinal(d3.schemeCategory10)
  //Format legend values as "$num" with no decimals
  const format = d3.format("($.0f")

  useEffect(() => {
    const data = createPie(props.data)
    const group = d3.select(ref.current)
    const groupWithData = group.selectAll("g.arc").data(data)

    groupWithData.exit().remove()

    const groupWithUpdate = groupWithData
      .enter()
      .append("g")
      .attr("class", "arc")

    const path = groupWithUpdate
      .append("path")
      .merge(groupWithData.select("path.arc"))

    path
      .attr("class", "arc")
      .attr("d", createArc)
      .attr("fill", (d, i) => colors(i))

    const legendGroup = groupWithUpdate
      .append("text")
      .merge(groupWithData.select("text"))
      .attr(
        "transform",
        (d, i) => `translate(` + (props.width - 270) + `,` + (i * 20 - 75) + `)`
      )
      .attr("class", "legend")

    legendGroup
      .text((d) => d.data.type + ": " + format(d.value))
      .style("font-size", 18)
      .style("fill", (d, i) => colors(i))
  }, [colors, createArc, createPie, format, props.data, props.width])

  return (
    <div className="expchart">
      <h2 className={styles.expheader}>Expenses by Category</h2>
      <svg width={props.width} height={props.height}>
        <g
          ref={ref}
          transform={`translate(${props.outerRadius} ${props.outerRadius})`}
        />
      </svg>
    </div>
  )
}

export default PieChart
