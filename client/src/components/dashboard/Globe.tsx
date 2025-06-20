import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

interface GlobeProps {
  width?: number;
  height?: number;
}

export default function Globe({ width = 180, height = 180 }: GlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    // Projection setup
    const projection = d3.geoOrthographic()
      .scale(Math.min(width, height) / 2 - 10)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule();

    // Draw water (sphere)
    svg
      .append("path")
      .datum({ type: "Sphere" })
      .attr("d", path as any)
      .attr("fill", "#e0f7fa");

    // Draw graticule lines
    svg
      .append("path")
      .datum(graticule())
      .attr("d", path as any)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 0.5);

    // Load and draw land
    d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then((topoData: any) => {
      console.log("World atlas data loaded:", topoData);
      const land = feature(topoData, topoData.objects.countries);
      console.log("Land features:", land);
      svg
        .append("path")
        .datum(land)
        .attr("d", path as any)
        .attr("fill", "#fbbf24")
        .attr("stroke", "#f59e0b")
        .attr("stroke-width", 0.3);
    }).catch((error) => {
      console.error("Failed to load world atlas:", error);
    });

    // Rotation animation
    let rotation = [0, 0];
    d3.timer((elapsed) => {
      rotation[0] = (elapsed * 0.02) % 360; // rotate slowly
      projection.rotate([-rotation[0], 0]);
      svg.selectAll("path").attr("d", path as any);
    });

  }, [width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    />
  );
}