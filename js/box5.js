const data = [
  { category: "One-month course (excl. accommodation)", year: "2024", averageCost: 1335 },
  { category: "One-month course (excl. accommodation)", year: "2019", averageCost: 1288 },
  { category: "One-month course (excl. accommodation)", year: "2014", averageCost: 948 },
  { category: "Residential accommodation (per week)", year: "2024", averageCost: 305 },
  { category: "Residential accommodation (per week)", year: "2019", averageCost: 279 },
  { category: "Residential accommodation (per week)", year: "2014", averageCost: 234 },
  { category: "Host family accommodation (per week)", year: "2024", averageCost: 256 },
  { category: "Host family accommodation (per week)", year: "2019", averageCost: 188 },
  { category: "Host family accommodation (per week)", year: "2014", averageCost: 183 }
];

const svgWidth = 700;
const svgHeight = 500;
const margin = { top: 50, right: 100, bottom: 50, left: 50 };
const innerWidth = svgWidth - margin.left - margin.right;
const innerHeight = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#box5")
  .append("svg")
  .attr("width", "100%")
  .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .style("font-family", "Roboto, sans-serif");
  
// title

svg.append("text")
  .attr("x", svgWidth / 2)
  .attr("y", margin.top - 15)
  .attr("text-anchor", "middle")
  .attr("font-size", "18px")
  .text("Average Cost Over Time");

const years = [...new Set(data.map(d => d.year))].sort();
const parsedDates = years.map(y => new Date(+y, 0, 1));

// Format data into line series
const series = d3.groups(data, d => d.category).map(([name, values]) => ({
  name,
  values: years.map(y => {
    const found = values.find(v => v.year === y);
    return found ? found.averageCost : NaN;
  })
}));

const x = d3.scaleUtc()
  .domain(d3.extent(parsedDates))
  .range([margin.left, svgWidth - margin.right]);

const y = d3.scaleLinear()
  .domain([0, d3.max(series, d => d3.max(d.values))])
  .nice()
  .range([svgHeight - margin.bottom, margin.top]);

const color = d3.scaleOrdinal()
  .domain(series.map(d => d.name))
  .range(["#4e79a7", "#f28e2b", "#e15759"]);

const line = d3.line()
  .defined(d => !isNaN(d))
  .x((d, i) => x(parsedDates[i]))
  .y(d => y(d));


// Axes
svg.append("g")
  .attr("transform", `translate(0,${svgHeight - margin.bottom})`)
  .call(d3.axisBottom(x)
  .ticks(svgWidth / 80)
)
  .call(g => g.select(".domain").remove())
  .call(g => g.selectAll("text").style("fill", "#c9c6c6"));

svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).tickSize(-innerWidth))
  .call(g => g.select(".domain").remove())
  .call(g => g.selectAll("text").style("fill", "#c9c6c6"))
  .call(g => g.selectAll("line").style("stroke", "#c9c6c6"));

const pathGroup = svg.append("g");

const lineGroups = pathGroup.selectAll(".path")
  .data(series)
  .join("g")
  .attr("class", "path");

lineGroups.append("path")
  .attr("fill", "none")
  .attr("stroke", d => color(d.name))
  .attr("stroke-width", 2.5)
  .attr("d", d => line(d.values))
  .attr("stroke-dasharray", function(d) {
    const length = this.getTotalLength();
    return `${length} ${length}`;
  })
  .attr("stroke-dashoffset", function(d) {
    return this.getTotalLength();
  })
  .transition()
  .duration(1200)
  .attr("stroke-dashoffset", 0);;

// Outer circles
lineGroups.each(function (d) {
  const group = d3.select(this);

  group.selectAll("circle.outer")
    .data(d.values)
    .join("circle")
    .attr("class", "outer")
    .attr("fill", "white")
    .attr("stroke", color(d.name))
    .attr("r", 0)
    .attr("cx", (v, i) => x(parsedDates[i]))
    .attr("cy", v => y(v))
    .transition()
       .delay((d, i) => i * 150)
       .duration(500)
       .attr("r", 6);

  const inner = group.selectAll("circle.inner")
    .data(d.values.map((v, i) => ({ value: v, date: parsedDates[i], category: d.name })))
    .join("circle")
    .attr("class", "inner")
    .attr("fill", color(d.name))
    .attr("r", 0)
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.value));


    inner.transition()
      .delay((d, i) => i * 150)
      .duration(800)
      .attr("r", 3);

    inner.on("mouseover", function (event, d) {
      const [xm, ym] = d3.pointer(event, svg.node());
      tooltipGroup.style("display", null).attr("transform", `translate(${xm },${ym})`);
          tooltipText5.text(`${d.category} (${d.date.getFullYear()}): £${d3.format(",")(d.value)}`);
          sizeTooltip(tooltipText5, tooltipPath5);
          d3.select(this).attr("r", 6);
    })
    .on("mouseout", function () {
      tooltipGroup.style("display", "none");
      d3.select(this).attr("r", 3);
    });
});

// End-of-line labels
lineGroups.append("text")
  .datum(d => ({ name: d.name, value: d.values[d.values.length - 1] }))
  .attr("x", x(parsedDates[parsedDates.length - 1]) - 5)
  .attr("y", d => y(d.value)-5)
  .attr("dy", d => d.name == "Host family accommodation (per week)" ? "3em" : "0.2em")
  .attr("dx", "-0.5em")
  .attr("fill", d => color(d.name))
  .attr("text-anchor", "end")
  .attr("dominant-baseline", "end")
  .style("font-size", "12px")
  .style("opacity", 0)
  .text(d => d.name)
  .transition()
    .delay(1000)
    .duration(500)
    .style("opacity", 1);


//  SVG-based tooltip
const tooltipGroup = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none")
  .style("pointer-events", "none");

const tooltipPath5 = tooltipGroup.append("path")
  .attr("fill", "white")
  .attr("stroke", "black");

const tooltipText5 = tooltipGroup.append("text")
  .attr("font-size", "12px")
  .attr("font-family", "Roboto, sans-serif");

function sizeTooltip(text, path) {
  const { x, y, width, height } = text.node().getBBox();
  text.attr("transform", `translate(${-width / 2},${15 - y})`);
  path.attr("d", `M${-width / 2 - 10}, 5H-5l5,-5l5,5H${width / 2 + 10}v${height + 20}h-${width + 20}z`);
}

// Hover interaction
lineGroups
  .on("mouseenter", function (event, d) {
    d3.select(this).raise();

    pathGroup.selectAll("path")
      .attr("stroke", p => p.name === d.name ? color(p.name) : "#ccc")
      .attr("stroke-width", p => p.name === d.name ? 4 : 2.5);

    pathGroup.selectAll("circle.outer")
      .attr("stroke", function () {
        return d3.select(this.parentNode).datum().name === d.name ? color(d.name) : "#ccc";
      });

    pathGroup.selectAll("circle.inner")
      .attr("fill", function () {
        return d3.select(this.parentNode).datum().name === d.name ? color(d.name) : "#ccc";
      });
  })
  .on("mouseleave", function () {
    pathGroup.selectAll("path")
      .attr("stroke", d => color(d.name))
      .attr("stroke-width", 2.5);

    pathGroup.selectAll("circle.outer")
      .attr("stroke", function () {
        return color(d3.select(this.parentNode).datum().name);
      });

    pathGroup.selectAll("circle.inner")
      .attr("fill", function () {
        return color(d3.select(this.parentNode).datum().name);
      });
  });
