import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface HeatmapProps {
  data: number[][];
  xLabels?: string[];
  yLabels?: string[];
  colorScale?: string[];
  title?: string;
  width?: number;
  height?: number;
}

export function Heatmap({
  data,
  xLabels = ["Very Low", "Low", "Medium", "High", "Very High"],
  yLabels = ["Very Low", "Low", "Medium", "High", "Very High"],
  colorScale = ["#10b981", "#10b981", "#f59e0b", "#f59e0b", "#ef4444"],
  title = "Risk Heatmap",
  width = 500,
  height = 400,
}: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Color scales
    const colorScaleFunc = d3.scaleLinear<string>()
      .domain([0, 1, 2, 3, 4])
      .range(colorScale as any);

    // Calculate cell dimensions
    const cellSize = Math.min(
      (width - 100) / data[0].length,
      (height - 100) / data.length
    );
    
    // Define margins
    const margin = {
      top: 40,
      right: 40,
      bottom: 50,
      left: 60
    };
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add title
    svg.append("text")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(title);

    // Add x-axis label (Loss Event Frequency)
    svg.append("text")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", data.length * cellSize + 35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Loss Event Frequency");

    // Add y-axis label (Probable Loss Magnitude)
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(data.length * cellSize) / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Probable Loss Magnitude");

    // Add x-axis labels
    svg.selectAll(".x-label")
      .data(xLabels)
      .enter()
      .append("text")
      .attr("class", "x-label")
      .attr("x", (d, i) => i * cellSize + cellSize / 2)
      .attr("y", data.length * cellSize + 15)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text(d => d);

    // Add y-axis labels
    svg.selectAll(".y-label")
      .data(yLabels)
      .enter()
      .append("text")
      .attr("class", "y-label")
      .attr("x", -10)
      .attr("y", (d, i) => i * cellSize + cellSize / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .style("font-size", "10px")
      .text(d => d);

    // Create heatmap cells
    const cells = svg.selectAll(".cell")
      .data(data.flatMap((row, rowIndex) => 
        row.map((value, colIndex) => ({
          value,
          row: rowIndex,
          col: colIndex
        }))
      ))
      .enter()
      .append("g")
      .attr("class", "cell");

    // Add cell rectangles
    cells.append("rect")
      .attr("x", d => d.col * cellSize)
      .attr("y", d => d.row * cellSize)
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("stroke", "#e2e8f0")
      .attr("fill", d => colorScaleFunc(Math.min(4, Math.max(0, d.col + d.row - 1))))
      .attr("opacity", 0.8);

    // Add cell text
    cells.append("text")
      .attr("x", d => d.col * cellSize + cellSize / 2)
      .attr("y", d => d.row * cellSize + cellSize / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .text(d => d.value);

    // Add legend
    const legendData = ["Low Risk", "Medium Risk", "High Risk"];
    const legendColors = ["#10b981", "#f59e0b", "#ef4444"];
    
    const legend = svg.append("g")
      .attr("transform", `translate(${(width - margin.left - margin.right) - 150}, 0)`);
    
    legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)
      .each(function(d, i) {
        // Add colored rectangle
        d3.select(this)
          .append("rect")
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", legendColors[i]);
        
        // Add text
        d3.select(this)
          .append("text")
          .attr("x", 20)
          .attr("y", 10)
          .style("font-size", "10px")
          .text(d);
      });
    
  }, [data, xLabels, yLabels, colorScale, title, width, height]);

  return <svg ref={svgRef} />;
}
