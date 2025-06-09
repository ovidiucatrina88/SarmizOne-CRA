import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { geoOrthographic, geoPath, geoGraticule } from "d3-geo";
import { feature } from "topojson-client";

interface DataItem {
  name: string;
  value: number;
  color: string;
  id: string;
}

interface SimpleRiskDistributionProps {
  assets: DataItem[];
  entities: DataItem[];
  totalRisk: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SimpleRiskDistribution({
  assets,
  entities,
  totalRisk,
}: SimpleRiskDistributionProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    name: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    console.log("SimpleRiskDistribution rendering with data:", {
      assets,
      entities,
      totalRisk,
    });

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = 500;

    svg.attr("width", width).attr("height", height);

    // Layout constants
    const centerX = width / 2;
    const centerY = height / 2;
    const globeRadius = 80;
    const boxHeight = 50;
    const boxSpacing = 20;
    const assetStartX = 50;
    const entityStartX = width - 250;

    // Prepare display data with fallbacks
    const assetsToDisplay =
      assets && assets.length > 0
        ? assets.slice(0, 5)
        : [
            {
              name: "CRM System",
              value: 950000,
              color: "#3b82f6",
              id: "asset1",
            },
            {
              name: "ERP System",
              value: 750000,
              color: "#60a5fa",
              id: "asset2",
            },
            {
              name: "HR Database",
              value: 550000,
              color: "#93c5fd",
              id: "asset3",
            },
            {
              name: "Cloud Storage",
              value: 350000,
              color: "#2563eb",
              id: "asset4",
            },
            {
              name: "Email Server",
              value: 250000,
              color: "#1d4ed8",
              id: "asset5",
            },
          ];

    const entitiesToDisplay =
      entities && entities.length > 0
        ? entities.slice(0, 3)
        : [
            {
              name: "Company X Emea",
              value: 2500000,
              color: "#f59e0b",
              id: "entity1",
            },
            {
              name: "Company Y US",
              value: 1800000,
              color: "#fbbf24",
              id: "entity2",
            },
            {
              name: "Another Company",
              value: 1200000,
              color: "#fb923c",
              id: "entity3",
            },
          ];

    // Draw asset boxes (left side, blue)
    assetsToDisplay.forEach((d, i) => {
      const y =
        centerY -
        (assetsToDisplay.length * (boxHeight + boxSpacing)) / 2 +
        i * (boxHeight + boxSpacing);
      const displayTotalRisk =
        assetsToDisplay.reduce((sum, item) => sum + item.value, 0) +
        entitiesToDisplay.reduce((sum, item) => sum + item.value, 0);
      const pct = ((d.value / (displayTotalRisk || 1)) * 100).toFixed(1) + "%";

      // Box
      svg
        .append("rect")
        .attr("x", assetStartX)
        .attr("y", y)
        .attr("width", 200)
        .attr("height", boxHeight)
        .attr("rx", 6)
        .attr("fill", "#3b82f6")
        .attr("opacity", 0.9)
        .attr("stroke", "#ffffff30")
        .attr("stroke-width", 1);

      // Name
      svg
        .append("text")
        .attr("x", assetStartX + 10)
        .attr("y", y + 20)
        .attr("fill", "#fff")
        .attr("font-size", "13px")
        .attr("font-weight", "600")
        .text(d.name.length > 18 ? d.name.substring(0, 18) + "..." : d.name);

      // Value
      svg
        .append("text")
        .attr("x", assetStartX + 10)
        .attr("y", y + 35)
        .attr("fill", "#fff")
        .attr("font-size", "11px")
        .text(`${formatCurrency(d.value)} (${pct})`);

      // Flow line
      svg
        .append("line")
        .attr("x1", assetStartX + 200)
        .attr("y1", y + boxHeight / 2)
        .attr("x2", centerX - globeRadius)
        .attr("y2", centerY)
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("opacity", 0.6);
    });

    // Draw entity boxes (right side, green)
    entitiesToDisplay.forEach((d, i) => {
      const y =
        centerY -
        (entitiesToDisplay.length * (boxHeight + boxSpacing)) / 2 +
        i * (boxHeight + boxSpacing);
      const displayTotalRisk =
        assetsToDisplay.reduce((sum, item) => sum + item.value, 0) +
        entitiesToDisplay.reduce((sum, item) => sum + item.value, 0);
      const pct = ((d.value / (displayTotalRisk || 1)) * 100).toFixed(1) + "%";

      // Box
      svg
        .append("rect")
        .attr("x", entityStartX)
        .attr("y", y)
        .attr("width", 200)
        .attr("height", boxHeight)
        .attr("rx", 6)
        .attr("fill", "#10b981")
        .attr("opacity", 0.9)
        .attr("stroke", "#ffffff30")
        .attr("stroke-width", 1);

      // Name
      svg
        .append("text")
        .attr("x", entityStartX + 10)
        .attr("y", y + 20)
        .attr("fill", "#fff")
        .attr("font-size", "13px")
        .attr("font-weight", "600")
        .text(d.name.length > 18 ? d.name.substring(0, 18) + "..." : d.name);

      // Value
      svg
        .append("text")
        .attr("x", entityStartX + 10)
        .attr("y", y + 35)
        .attr("fill", "#fff")
        .attr("font-size", "11px")
        .text(`${formatCurrency(d.value)} (${pct})`);

      // Flow line
      svg
        .append("line")
        .attr("x1", entityStartX)
        .attr("y1", y + boxHeight / 2)
        .attr("x2", centerX + globeRadius)
        .attr("y2", centerY)
        .attr("stroke", "#10b981")
        .attr("stroke-width", 2)
        .attr("opacity", 0.6);
    });

    // Globe setup - Projection and path functions
    const projection = d3
      .geoOrthographic()
      .scale(globeRadius - 5)
      .translate([centerX, centerY])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule();

    // Draw water (sphere)
    const sphere = svg
      .append("path")
      .datum({ type: "Sphere" })
      .attr("d", path as any)
      .attr("fill", "#e0f7fa")
      .attr("class", "globe-sphere");

    // Draw graticule lines
    const graticuleLines = svg
      .append("path")
      .datum(graticule())
      .attr("d", path as any)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 0.5)
      .attr("class", "globe-graticule");

    // Timer reference for cleanup
    let globeTimer: any = null;

    // Load and draw land
    d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((topoData: any) => {
        console.log("World atlas data loaded:", topoData);
        const land = feature(topoData, topoData.objects.countries);
        console.log("Land features:", land);
        
        const landPath = svg
          .append("path")
          .datum(land)
          .attr("d", path as any)
          .attr("fill", "#fbbf24")
          .attr("stroke", "#f59e0b")
          .attr("stroke-width", 0.3)
          .attr("class", "globe-land");

        // Rotation animation - only update globe paths
        let rotation = [0, 0];
        globeTimer = d3.timer((elapsed) => {
          rotation[0] = (elapsed * 0.02) % 360; // rotate slowly
          projection.rotate([-rotation[0], 0]);
          
          // Only update globe-related paths, not the entire SVG
          sphere.attr("d", path as any);
          graticuleLines.attr("d", path as any);
          landPath.attr("d", path as any);
        });
      })
      .catch((error) => {
        console.error("Failed to load world atlas:", error);
      });

    // Cleanup function to stop timer on unmount
    return () => {
      if (globeTimer) {
        globeTimer.stop();
      }
    };
  }, [assets, entities, totalRisk]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        className="w-full h-auto bg-gray-900 rounded-lg"
        style={{ maxHeight: "500px" }}
      />
      {hoverInfo && (
        <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-2 rounded shadow-lg">
          <div className="font-semibold">{hoverInfo.name}</div>
          <div className="text-sm">{formatCurrency(hoverInfo.value)}</div>
        </div>
      )}
    </div>
  );
}
