const data2 = [
  { year: 2014, avgStay: 4.7 },
  { year: 2019, avgStay: 3.6 },
  { year: 2024, avgStay: 3.0 }
];

// Chart dimensions
const margin2 = { top: 50, right: 10, bottom: 50, left: 50 },
      width2 = 300 - margin2.left - margin2.right,
      height2 = 500 - margin2.top - margin2.bottom;

// Create SVG
const svg2 = d3.select("#box2")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

svg2.append("text")
  .attr("x", width2/2 - 20)
  .attr("y", -margin2.top +30)
  .attr("text-anchor", "middle")
  .attr("font-family", "Roboto, sans-serif")
  .attr("dominant-baseline", "start")
  .attr("font-size", "16px")
  .text("Change in stay in UK schools (2014-2024)");

// X scale
const x2 = d3.scaleBand()
  .domain(data2.map(d => d.year))
  .range([0, width2])
  .padding(0.2);

// Y scale
const y2 = d3.scaleLinear()
  .domain([0, d3.max(data2, d => d.avgStay)])
  .nice()
  .range([height2, 0]);

// X axis
svg2.append("g")
  .attr("transform", `translate(0,${height2})`)
  .call(d3.axisBottom(x2).tickSizeOuter(0))
  .call(g => g.selectAll("text").style("fill", "#c9c6c6"))
  .call(g => g.selectAll("line").style("stroke", "#c9c6c6"))
  .call(g => g.selectAll(".domain").remove());


// Y axis
svg2.append("g")
  .call(d3.axisLeft(y2).tickSize(-innerWidth))
  .call(g => g.selectAll("line").style("stroke", "#c9c6c6"))
  .call(g => g.selectAll("text").style("fill", "#c9c6c6"))
  .call(g => g.selectAll(".domain").remove());

  // y axis label
svg2.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin2.left )
  .attr("x", -height2 / 2)
  .attr("dy", "1em")
  .attr("text-anchor", "middle")
  .attr("font-family", "Roboto, sans-serif")
  .attr("fill", "#c9c6c6")
  .text("Average stay (weeks)");


// Bars
svg2.selectAll("rect")
  .data(data2)
  .enter()
  .append("rect")
    .attr("x", d => x2(d.year))
    .attr("y", d => y2(d.avgStay))
    .attr("rx", 25)
    .attr("ry", 25)
    .attr("width", x2.bandwidth())
    .attr("height", d => height2 - y2(d.avgStay))
    .attr("fill", "#69b3a2");

// Labels on top of bars
svg2.selectAll("text.label")
  .data(data2)
  .enter()
  .append("text")
    .attr("class", "label")
    .attr("x", d => x2(d.year) + x2.bandwidth() / 2)
    .attr("y", d => y2(d.avgStay) - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-family", "Roboto, sans-serif")
    .attr("fill", "#c9c6c6")
    .text(d => d.avgStay);
