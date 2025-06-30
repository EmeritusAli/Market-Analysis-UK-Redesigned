const data4 = [
  { Region: "Western Europe", Year: "2024", Value: 38 },
  { Region: "Western Europe", Year: "2019", Value: 44 },
  { Region: "Western Europe", Year: "2014", Value: 39 },
  { Region: "C&E Europe", Year: "2024", Value: 20 },
  { Region: "C&E Europe", Year: "2019", Value: 20 },
  { Region: "C&E Europe", Year: "2014", Value: 19 },
  { Region: "Asia", Year: "2024", Value: 16 },
  { Region: "Asia", Year: "2019", Value: 17 },
  { Region: "Asia", Year: "2014", Value: 20 },
  { Region: "North America", Year: "2024", Value: 1 },
  { Region: "North America", Year: "2019", Value: 0 },
  { Region: "North America", Year: "2014", Value: 0 },
  { Region: "Latin America", Year: "2024", Value: 13 },
  { Region: "Latin America", Year: "2019", Value: 9 },
  { Region: "Latin America", Year: "2014", Value: 12 },
  { Region: "Middle East", Year: "2024", Value: 10 },
  { Region: "Middle East", Year: "2019", Value: 8 },
  { Region: "Middle East", Year: "2014", Value: 8 },
  { Region: "Africa", Year: "2024", Value: 2 },
  { Region: "Africa", Year: "2019", Value: 2 },
  { Region: "Africa", Year: "2014", Value: 1 },
  { Region: "Australasia", Year: "2024", Value: 0 },
  { Region: "Australasia", Year: "2019", Value: 0 },
  { Region: "Australasia", Year: "2014", Value: 1 },
];

// dimensions and margins
const margin4 = { top: 80, right: 30, bottom: 20, left: 130 },
      width4 = 500 - margin4.left - margin4.right,
      height4 = 500 - margin4.top - margin4.bottom;

const svg4 = d3.select("#box4")
  .append("svg")
  .attr("width", "100%")
  .attr("viewBox", `0 0 ${width4 + margin4.left + margin4.right} ${height4 + margin4.top + margin4.bottom}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr("transform", `translate(${margin4.left},${margin4.top})`);

const regions = Array.from(new Set(data4.map(d => d.Region)));
const years4 = ["2014", "2019", "2024"];

const x4 = d3.scaleBand().domain(years4).range([0, width4]).padding(0.3);
const y4 = d3.scaleBand().domain(regions).range([0, height4]).padding(0.3);
const r4 = d3.scaleSqrt().domain([0, d3.max(data4, d => d.Value)]).range([0, x4.bandwidth() / 4.5]);
const color4 = d3.scaleOrdinal()
  .domain(years4)
  .range(["#e15759", "#4e79a7", "#59a14f"]); // based on year

// Background stripes 
y4.domain().forEach((region, i) => {
  svg4.append("rect")
    .attr("x", -70)
    .attr("y", y4(region))
    .attr("width", width4 + 30)
    .attr("height", y4.bandwidth() +5)
    .attr("fill", i % 2 === 0 ? "#f7f7f7" : "#f7f7f7");
});

// Vertical dotted lines
x4.domain().forEach(year => {
  svg4.append("line")
    .attr("x1", x4(year)+ x4.bandwidth()/2)
    .attr("x2", x4(year)+ x4.bandwidth()/2 )
    .attr("y1", 0)
    .attr("y2", height4)
    .attr("stroke", "#ccc")
    .attr("stroke-dasharray", "2,2")
    .attr("stroke-width", 1);
});

// Axis labels
svg4.append("g")
  .selectAll("text")
  .data(years4)
  .enter()
  .append("text")
  .attr("x", d => x4(d) + x4.bandwidth()/2)
  .attr("y", -20)
  .attr("font-size", "14px")
  .attr("font-family", "Roboto, sans-serif")
  .attr("text-anchor", "middle")
  .attr("fill", "#c9c6c6")
  .text(d => d);

svg4.append("g")
  .selectAll("text")
  .data(regions)
  .enter()
  .append("text")
  .attr("x", 30)
  .attr("y", d => y4(d) + y4.bandwidth()/2)
  .attr("font-size", "12px")
  .attr("text-anchor", "end")
  .attr("alignment-baseline", "middle")
  .text(d => d);

    // Tooltip
const tooltip4 = d3.select("#box4 svg")
  .append("g")
  .attr("class", "tooltip4")
  .style("display", "none")
  .style("pointer-events", "none");

const tooltipPath4 = tooltip4.append("path")
  .attr("fill", "white")
  .attr("stroke", "black");

const tooltipText4 = tooltip4.append("text")
  .attr("font-size", "12px")
  .attr("font-family", "Roboto, sans-serif");

function sizeTooltip(text, path) {
  const { x, y, width, height } = text.node().getBBox();
  text.attr("transform", `translate(${-width / 2},${15 - y})`);
  path.attr("d", `M${-width / 2 - 10}, 5H-5l5,-5l5,5H${width / 2 + 10}v${height + 20}h-${width + 20}z`);
};



// Circles
const circle4 = svg4.selectAll("circle")
  .data(data4)
  .enter()
  .append("circle")
  .attr("cx", d => x4(d.Year) + x4.bandwidth()/2)
  // .attr("cy", d => y4(d.Region) + y4.bandwidth()/2)
  .attr("r", 0)
  .attr("fill", d => color4(d.Year))
  .attr("stroke", d => d3.rgb(color4(d.Year)).darker(1))
  .attr("fill-opacity", 0.8);
circle4.transition()
  .duration(1000)
  .delay((d, i) => i * 100)
  .attr("r", d => r4(d.Value))
  .attr("cy", d => y4(d.Region) + y4.bandwidth()/2);

circle4.on("mouseover", function(event, d) {
    const [xm, ym] = d3.pointer(event, svg4.node())
    d3.select("#box4").selectAll("circle").attr("fill-opacity", 0.3);
    d3.select(this).attr("fill-opacity", 1).attr("r", r4(d.Value) + 5);
    tooltip4.style("display", null);
    tooltip4.attr("transform", `translate(${xm + margin4.left},${ym + margin4.top})`);
    tooltipText4.text(`${d.Region}: ${d.Value}%`);
    sizeTooltip(tooltipText4, tooltipPath4);
  })
  .on("mouseout", function(event, d) {
    d3.select("#box4").selectAll("circle").attr("fill-opacity", 0.9).attr("r", d => r4(d.Value));
    tooltip4.style("display", "none");
  });

  // Labels inside larger circles
svg4.selectAll("text.value-label")
  .data(data4.filter(d => d.Value >= 10))
  .enter()
  .append("text")
  .attr("class", "value-label")
  .attr("x", d => x4(d.Year) + x4.bandwidth()/2)
  .attr("y", d => y4(d.Region) + y4.bandwidth()/2 + 4)
  .attr("text-anchor", "middle")
  .attr("font-size", "10px")
  .attr("fill", "white")
  .attr("font-family", "Roboto, sans-serif")
  .text(d => d.Value);

// Title
svg4.append("text")
  .attr("x", width4 / 2 - 50)
  .attr("y", -50)
  .attr("text-anchor", "middle")
  .attr("font-size", "15px")
  .attr("font-family", "Roboto, sans-serif")
  .attr("color", "#333")
  .text("Change in UK schools' marketing budget by region (2014-2024)");


  
