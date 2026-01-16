import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import styles from "../RetirementPlanner.module.scss"
import { formatCurrency } from "../utils/retirementCalculations"

const ScenarioComparison = ({ scenarios }) => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!scenarios || scenarios.length === 0) return

    const container = containerRef.current
    const width = container.clientWidth || 400
    const height = 250
    const margin = { top: 20, right: 30, bottom: 40, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(scenarios, (d) => d.finalBalance) * 1.1])
      .range([0, innerWidth])

    const yScale = d3
      .scaleBand()
      .domain(scenarios.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.3)

    g.selectAll(".bar")
      .data(scenarios)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d.name))
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("width", 0)
      .attr("fill", (d) => d.color)
      .attr("rx", 4)
      .transition()
      .duration(800)
      .attr("width", (d) => xScale(d.finalBalance))

    g.selectAll(".bar-label")
      .data(scenarios)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("x", (d) => xScale(d.finalBalance) + 5)
      .attr("dy", "0.35em")
      .attr("fill", "#333")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => formatCurrency(d.finalBalance))

    const yAxis = d3.axisLeft(yScale)

    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .attr("fill", "#666")
      .attr("font-size", "12px")

    g.selectAll(".rate-label")
      .data(scenarios)
      .enter()
      .append("text")
      .attr("class", "rate-label")
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("x", 10)
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .attr("font-size", "11px")
      .text((d) => `${(d.rate * 100).toFixed(0)}% return`)
  }, [scenarios])

  return (
    <div className={styles.scenarioComparison} ref={containerRef}>
      <h2 className={styles.sectionTitle}>Scenario Comparison</h2>
      <p className={styles.scenarioSubtitle}>
        See how different investment strategies affect your retirement balance
      </p>
      <svg ref={svgRef}></svg>
      <div className={styles.scenarioDetails}>
        {scenarios.map((scenario) => (
          <div
            key={scenario.name}
            className={styles.scenarioCard}
            style={{ borderLeftColor: scenario.color }}
          >
            <h4>{scenario.name}</h4>
            <p>{scenario.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScenarioComparison
