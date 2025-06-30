const data1 = [
  { Recruitment: "Agents", year: "2024", percentage: 81 },
  { Recruitment: "Agents", year: "2019", percentage: 77 },
  { Recruitment: "Agents", year: "2014", percentage: 54 },
  { Recruitment: "Internet", year: "2024", percentage: 5 },
  { Recruitment: "Internet", year: "2019", percentage: 12 },
  { Recruitment: "Internet", year: "2014", percentage: 22 },
  { Recruitment: "Local bookings", year: "2024", percentage: 1 },
  { Recruitment: "Local bookings", year: "2019", percentage: 5 },
  { Recruitment: "Local bookings", year: "2014", percentage: 11 },
  { Recruitment: "Repeat bookings", year: "2024", percentage: 11 },
  { Recruitment: "Other", year: "2024", percentage: 2 },
  { Recruitment: "Other", year: "2019", percentage: 6 },
  { Recruitment: "Other", year: "2014", percentage: 13 }
];

// Setup
const years1 = ["2014", "2019", "2024"];
const width1 = 248;
const height1 = 300;
const radius = Math.min(width1, height1) / 2.5;
const innerRadius = radius * 0.6;

// color1 scale
const color1 = d3.scaleOrdinal()
  .domain(["Agents", "Internet", "Local bookings", "Repeat bookings", "Other"])
  .range(["#4285F4", "#EA4335", "#34A853", "#FBBC04", "#A142F4"]);

// container
const container = d3.select("#box1")
container.append("h3")
  .text("Recruitment Method by Year")
  .style("font-family", "Roboto, sans-serif")
  .style("font-size", "18px")
  .style("text-align", "center")
  .style("margin-bottom", "10px");

const legendData = color1.domain();

const legend = container.append("div")
  .attr("class", "legend")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("gap", "10px")
  .style("margin-bottom", "15px");

legend.selectAll("div")
  .data(legendData)
  .enter()
  .append("div")
  .style("display", "flex")
  .style("align-items", "center")
  .style("gap", "6px")
  .html(d => `
    <div style="width: 10px; height: 10px; background:${color1(d)}; border-radius: 50%;"></div>
    <span style="font-family: Roboto, sans-serif; font-size: 10px;">${d}</span>
  `);


const chartRow = container.append("div")
  .attr("class", "chart-row")
  .style("display", "flex")
  .style("gap", "10px") // spacing
  .style("justify-content", "center");

// Pie and Arc setup
const pie = d3.pie()
  .sort(null)
  .value(d => d.percentage);

const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(radius - 10)
  .cornerRadius(4);

const outerArc = d3.arc()
  .innerRadius(radius * 1.05)
  .outerRadius(radius * 1.05);

// Tooltip
const tooltip1 = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("display", "none")
  .style("pointer-events", "none")
  .style("padding", "6px 10px")
  .style("background", "white")
  .style("border", "1px solid black")
  .style("border-radius", "4px")
  .style("font-family", "Roboto, sans-serif")
  .style("font-size", "12px")
  .style("box-shadow", "0 2px 6px rgba(0,0,0,0.2)")
  .style("z-index", 1000);

const tooltipGroup1 = tooltip1.append("g");
const tooltipPath1 = tooltipGroup1.append("path")
  .attr("fill", "white")
  .attr("stroke", "black");

const tooltipText1 = tooltipGroup1.append("text");

function sizeTooltip(text, path) {
  const { x, y, width, height } = text.node().getBBox();
  text.attr("transform", `translate(${-width / 2},${15 - y})`);
  path.attr("d", `M${-width / 2 - 10}, 5H-5l5,-5l5,5H${width / 2 + 10}v${height + 20}h-${width + 20}z`);
}

// Render for each year
years1.forEach(year => {
  const svg = chartRow
    .append("svg")
    .attr("viewBox", `0 0 ${width1} ${height1}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("width", "100%")
    .append("g")
    .attr("transform", `translate(${(width1 / 2) - 5}, ${height1 / 2})`);

  const yearData = data1.filter(d => d.year === year);
  const arcs = pie(yearData);

  // Animate each path
  const path = svg.selectAll("path")
    .data(arcs)
    .enter()
    .append("path")
    .attr("fill", d => color1(d.data.Recruitment))
    .transition()
    .duration(1000)
    .attrTween("d", function(d) {
      const i = d3.interpolate(
        { startAngle: 0, endAngle: 0 },
        d
      );
      return function(t) {
        return arc(i(t));
      };
    });

  // Redraw without transition to capture proper arc geometry for tooltips
  const staticPaths = svg.selectAll("path.static")
    .data(arcs)
    .enter()
    .append("path")
    .attr("class", "static")
    .attr("fill", d => color1(d.data.Recruitment))
    .attr("d", arc)
    .style("opacity", 0)  // invisible, just for interactivity
    .on("mouseover", function(event, d){
      tooltip1
        .style("display", "block")
        .html(`<strong>${d.data.Recruitment}</strong> (${d.data.year}): ${d.data.percentage}%`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", function(){
      tooltip1.style("display", "none");
    });

  // Labels
  svg.selectAll("text.label")
    .data(arcs)
    .enter()
    .append("text")
    .attr("transform", d => `translate(${outerArc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("opacity", 0)
    .attr("transform", d => `translate(${outerArc.centroid(d)})`)
    .text(d => `${d.data.percentage}%`)
    .transition()
    .delay(1000)
    .duration(300)
    .style("opacity", 1)  // Fade in labels after paths are drawn
    ;

  // Year in center
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("y", 6)
    .attr("font-family", "Roboto, sans-serif")
    .attr("fill", "gray")
    .style("font-weight", "bold")
    .text(year);
});


