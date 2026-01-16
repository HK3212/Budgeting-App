import React, { useEffect, useRef } from "react"
import * as d3 from "d3"
import styles from "../RetirementPlanner.module.scss"
import { formatCurrency } from "../utils/retirementCalculations"

const ProjectionChart = ({ projection, retirementAge }) => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!projection || projection.length === 0) return

    const container = containerRef.current
    const width = container.clientWidth || 600
    const height = 350
    const margin = { top: 20, right: 30, bottom: 50, left: 70 }
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
      .domain(d3.extent(projection, (d) => d.age))
      .range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(projection, (d) => d.balance) * 1.1])
      .range([innerHeight, 0])

    const areaAccumulation = d3
      .area()
      .x((d) => xScale(d.age))
      .y0(innerHeight)
      .y1((d) => yScale(d.phase === "accumulation" ? d.balance : 0))
      .curve(d3.curveMonotoneX)

    const areaRetirement = d3
      .area()
      .x((d) => xScale(d.age))
      .y0(innerHeight)
      .y1((d) => yScale(d.phase === "retirement" ? d.balance : 0))
      .curve(d3.curveMonotoneX)

    const line = d3
      .line()
      .x((d) => xScale(d.age))
      .y((d) => yScale(d.balance))
      .curve(d3.curveMonotoneX)

    const accumulationData = projection.filter(
      (d) => d.phase === "accumulation"
    )
    const retirementData = projection.filter((d) => d.phase === "retirement")

    g.append("path")
      .datum(accumulationData)
      .attr("fill", "rgba(16, 185, 129, 0.3)")
      .attr("d", areaAccumulation)

    g.append("path")
      .datum(retirementData)
      .attr("fill", "rgba(245, 158, 11, 0.3)")
      .attr("d", areaRetirement)

    g.append("path")
      .datum(projection)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 2.5)
      .attr("d", line)

    if (retirementAge) {
      g.append("line")
        .attr("x1", xScale(retirementAge))
        .attr("x2", xScale(retirementAge))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")

      g.append("text")
        .attr("x", xScale(retirementAge))
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .attr("fill", "#ef4444")
        .attr("font-size", "12px")
        .text("Retirement")
    }

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => `Age ${d}`)
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => formatCurrency(d))

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "#666")

    g.append("g").call(yAxis).selectAll("text").attr("fill", "#666")

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .attr("font-size", "14px")
      .text("Age")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -55)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .attr("font-size", "14px")
      .text("Portfolio Value")

    const legend = g
      .append("g")
      .attr("transform", `translate(${innerWidth - 150}, 10)`)

    legend
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "rgba(16, 185, 129, 0.5)")

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .text("Accumulation")

    legend
      .append("rect")
      .attr("y", 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "rgba(245, 158, 11, 0.5)")

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 32)
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .text("Retirement")

    const tooltip = d3
      .select(container)
      .append("div")
      .attr("class", styles.tooltip)
      .style("opacity", 0)

    const focus = g.append("g").style("display", "none")

    focus.append("circle").attr("r", 6).attr("fill", "#10b981")

    svg
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseover", () => {
        focus.style("display", null)
        tooltip.style("opacity", 1)
      })
      .on("mouseout", () => {
        focus.style("display", "none")
        tooltip.style("opacity", 0)
      })
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event)
        const age = Math.round(xScale.invert(mouseX))
        const dataPoint = projection.find((d) => d.age === age)

        if (dataPoint) {
          focus.attr(
            "transform",
            `translate(${xScale(dataPoint.age)},${yScale(dataPoint.balance)})`
          )

          tooltip
            .html(
              `<strong>Age ${dataPoint.age}</strong><br/>
               Balance: ${formatCurrency(dataPoint.balance)}<br/>
               Phase: ${dataPoint.phase}`
            )
            .style("left", `${event.offsetX + 15}px`)
            .style("top", `${event.offsetY - 10}px`)
        }
      })

    return () => {
      tooltip.remove()
    }
  }, [projection, retirementAge])

  return (
    <div className={styles.chartContainer} ref={containerRef}>
      <h2 className={styles.chartTitle}>Portfolio Projection</h2>
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default ProjectionChart
