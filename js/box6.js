const data6 = [
  { nationality: "Italian", year: "2024", percentage: 21 },
  { nationality: "Italian", year: "2019", percentage: 24 },
  { nationality: "Italian", year: "2014", percentage: 13 },
  { nationality: "Saudi", year: "2024", percentage: 13 },
  { nationality: "Saudi", year: "2019", percentage: 7 },
  { nationality: "Saudi", year: "2014", percentage: 4 },
  { nationality: "Turkish", year: "2024", percentage: 8 },
  { nationality: "Turkish", year: "2019", percentage: 2 },
  { nationality: "Turkish", year: "2014", percentage: 4 },
  { nationality: "Spanish", year: "2024", percentage: 7 },
  { nationality: "Spanish", year: "2019", percentage: 11 },
  { nationality: "Spanish", year: "2014", percentage: 7 },
  { nationality: "Swiss", year: "2024", percentage: 6 },
  { nationality: "Swiss", year: "2019", percentage: 4 },
  { nationality: "Swiss", year: "2014", percentage: 1 },
  { nationality: "Korean", year: "2024", percentage: 5 },
  { nationality: "Korean", year: "2019", percentage: 2 },
  { nationality: "Korean", year: "2014", percentage: 6 },
  { nationality: "French", year: "2024", percentage: 5 },
  { nationality: "French", year: "2019", percentage: 11 },
  { nationality: "French", year: "2014", percentage: 7 },
  { nationality: "Japanese", year: "2024", percentage: 5 },
  { nationality: "Japanese", year: "2019", percentage: 5 },
  { nationality: "Japanese", year: "2014", percentage: 5 },
  { nationality: "Brazilian", year: "2024", percentage: 4 },
  { nationality: "Brazilian", year: "2019", percentage: 3 },
  { nationality: "Brazilian", year: "2014", percentage: 5 },
  { nationality: "Chinese", year: "2024", percentage: 4 },
  { nationality: "Chinese", year: "2019", percentage: 7 },
  { nationality: "Chinese", year: "2014", percentage: 3 }
];


// Group data by nationality
const nationalities = d3.group(data6, d => d.nationality);
const years6 = new Set(data6.map(d => d.year));

// Dimensions
const width6 = 500;
const height6 = 500; 
const marginTop = 120;
const marginRight = 90;
const marginBottom = 30;
const marginLeft = 40;

const yearColors = {
  "2024": "#59a14f",
  "2019": "#4e79a7",
  "2014": "#e15759"
};

const yearOffset = {
  "2014": -8,
  "2019": 0,
  "2024": 8
};

// Scales
const x6 = d3.scaleLinear()
  .domain([0, d3.max(data6, d => d.percentage)])
  .rangeRound([marginLeft, width6 - marginRight]);

const y6 = d3.scalePoint()
  .domain(d3.sort(nationalities.keys()))
  .rangeRound([marginTop, height6 - marginBottom])
  .padding(1);



const color6 = d3.scaleOrdinal()
  .domain([...years6])
  .range(years6.size === 3 ? [yearColors["2024"], yearColors["2019"], yearColors["2014"]] : d3.schemeSet1);

// SVG container
const svg6 = d3.select("#box6")
      .append("svg")
      .attr("width", "100%")
      .attr("viewBox", [0, 0, width6, height6])
      .attr("preserveAspectRatio", "xMinYMin meet");


// X axis
svg6.append("g")
  .attr("transform", `translate(0,${marginTop})`)
  .call(d3.axisTop(x6).ticks(5).tickFormat(d => `${d}%`))
  .call(g => g.selectAll("text").style("fill", "#c9c6c6"))
  .call(g => g.append("text")
    .text("Percentage →")
    .attr("fill", "#c9c6c6")
    .attr("x", width6 - marginRight)
    .attr("dy", -22)
    .attr("text-anchor", "end"))
  .call(g => g.selectAll(".tick line")
    .clone()
    .attr("stroke-opacity", 0.1)
    .attr("y2", height6 - marginBottom))
  .call(g => g.select(".domain").remove());

// Groups by nationality
const g = svg6.append("g")
  .attr("text-anchor", "end")
  .style("font", "12px sans-serif")
  .selectAll()
  .data(nationalities)
  .join("g")
  .attr("transform", ([nat]) => `translate(0,${y6(nat)})`);

// lines
g.append("line")
  .attr("stroke", "#aaa")
  .attr("stroke-opacity", 0.5)
  .attr("stroke-width", 1.5)
  .attr("x1", x6(0))
  .attr("x2", x6(0))
  .transition()
  .duration(500)
  .attr("x1", ([, values]) => x6(d3.min(values, d => d.percentage)))
  .attr("x2", ([, values]) => x6(d3.max(values, d => d.percentage)));

// Tooltip group
const tooltip6 = svg6.append("g")
  .attr("class", "tooltip6")
  .style("display", "none")
  .style("pointer-events", "none");

const tooltipPath6 = tooltip6.append("path")
  .attr("fill", "white")
  .attr("stroke", "black");

const tooltipText6 = tooltip6.append("text")
  .attr("font-size", "12px")
  .attr("font-family", "Roboto, sans-serif");

function sizeTooltip6(text, path) {
  const { x, y, width, height } = text.node().getBBox();
  text.attr("transform", `translate(${-width / 2},${15 - y})`);
  path.attr("d", `M${-width / 2 - 10}, 5H-5l5,-5l5,5H${width / 2 + 10}v${height + 20}h-${width + 20}z`);
}

// Dots
const allCircles = g.append("g")
            .selectAll("circle")
            .data(([, values]) => values)
            .join("circle")
            .attr("class", "dot")
            .attr("cx",x6(0))
            .attr("fill", d => color6(d.year))
            .attr("fill-opacity", 0.8)
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            // .attr("stroke", d => d3.rgb(color6(d.Year)).darker(1))
            .attr("r", 10.5);

          // Transition 
allCircles.transition()
            .duration(1200)
            .attr("cx", d => x6(d.percentage) + yearOffset[d.year]);


allCircles.on("mouseover", function(event, d) {
                const [xm, ym] = d3.pointer(event, svg6.node());
                svg6.selectAll(".dot").attr("fill-opacity", 0.2);
                d3.select(this)
                .attr("fill-opacity", 1)
                .attr("r", 16);
                tooltip6.style("display", null)
                .attr("transform", `translate(${xm},${ym})`);
                tooltipText6.text(`${d.nationality} (${d.year}): ${d.percentage}%`);
                sizeTooltip6(tooltipText6, tooltipPath6);
            })
            .on("mouseout", function() {
                svg6.selectAll(".dot")
                .attr("fill-opacity", 0.8)
                .attr("r", 10.5);
                tooltip6.style("display", "none");
            });

// label for highest and lowest dots in the dot
svg6.append("g")
  .selectAll("text")
  .data(data6.filter(d =>
    d.percentage === d3.max(data6, d => d.percentage) ||
    d.percentage === d3.min(data6, d => d.percentage)
  ))
  .join("text")
  .attr("x", d => x6(d.percentage) + yearOffset[d.year] )
  .attr("y", d => y6(d.nationality)) 
  .attr("dy", "0.35em")
  .attr("font-size", "9px")
  .attr("font-family", "Roboto, sans-serif")
  .attr("fill", "white")
  .attr("text-anchor", "middle")
  .text(d => `${d.percentage}%`);

// Add legend for year colors
const legend6 = svg6.append("g")
  .attr("transform", `translate(${width6/2 - 100}, ${marginTop/2 - 10})`);

["2014", "2019", "2024"].forEach((year, i) => {
  const group = legend6.append("g")
    .attr("transform", `translate(${i * 80}, 0)`);

  group.append("circle")
    .attr("class", "legend-circle")
    .attr("r", 5)
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("fill", yearColors[year]);

  group.append("text")
    .attr("x", 10)
    .attr("y", 4)
    .attr("font-size", "12px")
    .attr("text-anchor", "start")
    .attr("font-family", "Roboto, sans-serif")
    .text(year);
});

// Labels
g.append("text")
  .attr("dy", "0.5em")
  .attr("x", ([, values]) => x6(d3.min(values, d => d.percentage)) - 18)
  .attr("y", -4)
  .attr("text-anchor", "end")
  .attr("font-size", "14px")
  .attr("opacity", 0)
  .text(([nat]) => nat)
  .transition()
  .ease(d3.easeCubicInOut)
  .duration(1000)
  .delay(900)
  .attr("opacity", 1);

  // Add title
svg6.append("text")
  .attr("x", width6 / 2)
  .attr("y", marginTop / 2 - 30)
  .attr("text-anchor", "middle")
  .attr("font-size", "18px")
  .attr("font-family", "Roboto, sans-serif")
  .attr("fill", "#333")
  .text("Nationality Representation by Year");