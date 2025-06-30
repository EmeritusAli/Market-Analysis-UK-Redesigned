/*///////////////////////////////////////////////////////////  
//Box 1: Recruitment Method by Year
//////////////////////////////////////////////////////////*/

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



/*///////////////////////////////////////////////////////////  
// Box 2: Change in stay in UK schools (2014-2024)
//////////////////////////////////////////////////////////*/


const data2 = [
  { year: 2014, avgStay: 4.7 },
  { year: 2019, avgStay: 3.6 },
  { year: 2024, avgStay: 3.0 }
];

// Chart dimensions
const margin2 = { top: 50, right: 10, bottom: 50, left: 50 },
      width2 = 300 - margin2.left - margin2.right,
      height2 = 500 - margin2.top - margin2.bottom;

//  SVG
const svg2 = d3.select("#box2")
  .append("svg")
    .attr("width", "100%")
    .attr("viewBox", `0 0 ${width2 + margin2.left + margin2.right} ${height2 + margin2.top + margin2.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
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
  .call(d3.axisLeft(y2).tickSize(-width2))  // Add grid lines
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
    .attr("y", height2) // start from bottom
    .attr("rx", 25)
    .attr("ry", 25)
    .attr("width", x2.bandwidth())
    .attr("height", 0) // initial height is 0
    .attr("fill", "#69b3a2")
  .transition()
    .duration(1000)
    .attr("y", d => y2(d.avgStay)) // grow upwards
    .attr("height", d => height2 - y2(d.avgStay));

// Labels on top of bars
svg2.selectAll("text.label")
  .data(data2)
  .enter()
  .append("text")
    .attr("class", "label")
    .attr("x", d => x2(d.year) + x2.bandwidth() / 2)
    .attr("y", height2 - 5) // start near bottom
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-family", "Roboto, sans-serif")
    .attr("fill", "#c9c6c6")
    .style("opacity", 0)
    .text(d => d.avgStay)
  .transition()
    .delay(1000) 
    .duration(300)
    .attr("y", d => y2(d.avgStay) - 5)
    .style("opacity", 1);
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


  
const dataB = [
  { age: "0-11 years", year: 2014, value: 2 },
  { age: "0-11 years", year: 2019, value: 10 },
  { age: "0-11 years", year: 2024, value: 4 },
  { age: "12-15 years", year: 2014, value: 20 },
  { age: "12-15 years", year: 2019, value: 37 },
  { age: "12-15 years", year: 2024, value: 30 },
  { age: "16-18 years", year: 2014, value: 18 },
  { age: "16-18 years", year: 2019, value: 31 },
  { age: "16-18 years", year: 2024, value: 27 },
  { age: "19-24 years", year: 2014, value: 25 },
  { age: "19-24 years", year: 2019, value: 11 },
  { age: "19-24 years", year: 2024, value: 14 },
  { age: "25-30 years", year: 2014, value: 16 },
  { age: "25-30 years", year: 2019, value: 5 },
  { age: "25-30 years", year: 2024, value: 8 },
  { age: "31-50 years", year: 2014, value: 14 },
  { age: "31-50 years", year: 2019, value: 4 },
  { age: "31-50 years", year: 2024, value: 12 },
  { age: "51+ years", year: 2014, value: 4 },
  { age: "51+ years", year: 2019, value: 2 },
  { age: "51+ years", year: 2024, value: 5 }
];

const colors = [
  "#e8e8e8", "#e4acac", "#c85a5a",
  "#b0d5df", "#ad9ea5", "#985356",
  "#64acbe"
];

const ageGroups = [
  "0-11 years", "12-15 years", "16-18 years", "19-24 years",
  "25-30 years", "31-50 years", "51+ years"
];

const colorB = d3.scaleOrdinal()
  .domain(ageGroups)
  .range(colors);

const yearsB = [...new Set(dataB.map(d => d.year))];

const width = 900;
const height = 500;
const marginB = { top: 150, right: 0, bottom: 20, left: 100 };
const barHeight = 60;

const xB = d3.scaleLinear()
  .domain([0, 100])
  .range([marginB.left, width - marginB.right]);

const svgB = d3.select("#box4b")
  .append("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("width", "100%")
  .attr("preserveAspectRatio", "xMidYMid meet")
  ;

// Title
svgB.append("text")
  .attr("x", width / 2)
  .attr("y", marginB.top / 2)
  .attr("text-anchor", "middle")
  .attr("font-size", "20px")
  .attr("font-family", "Roboto, sans-serif")
  .text("Age Group Distribution by Year");

// Bars and Labels
yearsB.forEach((year, i) => {
  const yearData = dataB.filter(d => d.year === year);
  let yB = marginB.top + i * (barHeight + 20);
  let xOffset = marginB.left;

  yearData.forEach(d => {
    const segmentWidth = xB(d.value) - xB(0);

const rect4 = svgB.append("rect")
      .attr("x", xOffset)
      .attr("y", yB)
      .attr("width", 0)
      .attr("height", barHeight)
      .attr("stroke", "gray")
      .attr("stroke-opacity",0.5)
      .attr("fill", colorB(d.age));

rect4.transition()
      .duration(600)
      .delay(i * 150)
      .attr("width", segmentWidth);

rect4.on("mouseover", function (e) {
        d3.select(this).attr("stroke", "black");

        const [xm, ym] = d3.pointer(e);
        tooltipB.style("display", null)
          .attr("transform", `translate(${xm},${ym})`);

        tooltipTextB.text(`${d.age}: ${d.value}%`);
        sizeTooltipB(tooltipTextB, tooltipPathB);
      })
      .on("mousemove", function (e) {
        const [xm, ym] = d3.pointer(e);
        tooltipB.attr("transform", `translate(${xm},${ym})`);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("stroke", "gray");
        tooltipB.style("display", "none");
      });
      
      // labels inside the bars
    svgB.append("text")
      .attr("x", xOffset + segmentWidth / 2)
      .attr("y", yB + barHeight / 2 + 4)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "11px")
      .attr("opacity", 0)
      .text(`${d.value}%`)
      .transition()
      .duration(600)
      .delay(i * 150 + 600)
      .attr("opacity", 1);

    xOffset += segmentWidth;
  });

  svgB.append("text")
    .attr("x", marginB.left)
    .attr("y", yB - 6)
    .attr("text-anchor", "start")
    .attr("font-size", "10px")
    .attr("fill", "#6F68A7")
    .text(`Age group distribution in ${year}`);
});

// size helper
function sizeTooltipB(text, path) {
  const { x, y, width: w, height: h } = text.node().getBBox();
  text.attr("transform", `translate(${-w / 2},${15 - y})`);
  path.attr("d", `M${-w / 2 - 10}, 5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);}


// Legend
const legendB = svgB.append("g")
  .attr("transform", `translate(${marginB.left},${100})`);

ageGroups.forEach((age, i) => {
  const group = legendB.append("g")
    .attr("transform", `translate(${i * 120}, 0)`);

  group.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", colorB(age));

  group.append("text")
    .attr("x", 18)
    .attr("y", 10)
    .text(age)
    .attr("font-size", "10px")
    .attr("fill", "#444");
});

    const tooltipB = svgB.append("g")
  .style("display", "none")
  .style("pointer-events", "none");

const tooltipPathB = tooltipB.append("path")
  .attr("fill", "white")
  .attr("stroke", "black");

const tooltipTextB = tooltipB.append("text")
  .attr("font-size", "12px")
  .attr("font-family", "Roboto, sans-serif");
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
const data7 = [
  { category: "Agency costs", year: "2024", percentage: 49, type: "agency" },
  { category: "Agency costs", year: "2019", percentage: 29, type: "agency" },
  { category: "Agency costs", year: "2014", percentage: 33, type: "agency" },
  { category: "Commission", year: "2024", percentage: 45, type: "agency" },
  { category: "Commission", year: "2019", percentage: 25, type: "agency" },
  { category: "Commission", year: "2014", percentage: 28, type: "agency" },
  { category: "Agency brochures", year: "2024", percentage: 2, type: "agency" },
  { category: "Agency brochures", year: "2019", percentage: 3, type: "agency" },
  { category: "Agency brochures", year: "2014", percentage: 2, type: "agency" },
  { category: "Incentives", year: "2024", percentage: 2, type: "agency" },
  { category: "Incentives", year: "2019", percentage: 1, type: "agency" },
  { category: "Incentives", year: "2014", percentage: 3, type: "agency" },
  
  { category: "Travel costs", year: "2024", percentage: 36, type: "travel" },
  { category: "Travel costs", year: "2019", percentage: 42, type: "travel" },
  { category: "Travel costs", year: "2014", percentage: 31, type: "travel" },
  { category: "Agent workshops", year: "2024", percentage: 22, type: "travel" },
  { category: "Agent workshops", year: "2019", percentage: 19, type: "travel" },
  { category: "Agent workshops", year: "2014", percentage: 14, type: "travel" },
  { category: "Agency visits", year: "2024", percentage: 3, type: "travel" },
  { category: "Agency visits", year: "2019", percentage: 4, type: "travel" },
  { category: "Agency visits", year: "2014", percentage: 4, type: "travel" },
  { category: "Marketing trips", year: "2024", percentage: 9, type: "travel" },
  { category: "Marketing trips", year: "2019", percentage: 15, type: "travel" },
  { category: "Marketing trips", year: "2014", percentage: 8, type: "travel" },
  { category: "Entertainment", year: "2024", percentage: 1, type: "travel" },
  { category: "Entertainment", year: "2019", percentage: 1, type: "travel" },
  { category: "Entertainment", year: "2014", percentage: 3, type: "travel" },
  { category: "Student exhibitions", year: "2024", percentage: 1, type: "travel" },
  { category: "Student exhibitions", year: "2019", percentage: 3, type: "travel" },
  { category: "Student exhibitions", year: "2014", percentage: 2, type: "travel" },
  
  { category: "Publicity costs", year: "2024", percentage: 15, type: "publicity" },
  { category: "Publicity costs", year: "2019", percentage: 29, type: "publicity" },
  { category: "Publicity costs", year: "2014", percentage: 36, type: "publicity" },
  { category: "Internet", year: "2024", percentage: 6, type: "publicity" },
  { category: "Internet", year: "2019", percentage: 14, type: "publicity" },
  { category: "Internet", year: "2014", percentage: 21, type: "publicity" },
  { category: "Own brochures", year: "2024", percentage: 8, type: "publicity" },
  { category: "Own brochures", year: "2019", percentage: 14, type: "publicity" },
  { category: "Own brochures", year: "2014", percentage: 11, type: "publicity" },
  { category: "Magazine for agents", year: "2024", percentage: 1, type: "publicity" },
  { category: "Magazine for agents", year: "2019", percentage: 1, type: "publicity" },
  { category: "Magazine for agents", year: "2014", percentage: 1, type: "publicity" },
  { category: "Magazine for students", year: "2024", percentage: 0, type: "publicity" },
  { category: "Magazine for students", year: "2019", percentage: 0, type: "publicity" },
  { category: "Magazine for students", year: "2014", percentage: 3, type: "publicity" }
];

// dimensions
const margins7 = ({
  top: 110,
  bottom: 30,
  left: 160,
  right: 15
});
const width7 = 980;
const height7 = 700;

// scales
const x7 = d3.scaleBand()
    .domain(Array.from(new Set(data7.map(d => d.year))).sort())
    .range([margins7.left, width7 - margins7.right]);

const y7 = d3.scaleBand()
    .domain(Array.from(new Set(data7.map(d => d.category))))
    .range([height7 - margins7.bottom, margins7.top]);
const color7 = d3.scaleSequential()
          .interpolator(d3.interpolatePlasma)
          .domain([0, d3.max(data7, d => d.percentage)])

const svg7 = d3.select("#box7")
            .append("svg")
                .attr("width", "100%")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", [0,0,width7,height7]);

 //  x-axis and label.
  const xaxis = svg7.append("g")
      .attr("transform", `translate(0,${height7 - margins7.bottom})`)
      .call(d3.axisBottom(x7).tickSize(0))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.append("text")
          .attr("x", width7)
          .attr("y", margins7.bottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("year →"));
  //  y-axis and label, and remove the domain line.
  const yaxis = svg7.append("g")
      .attr("transform", `translate(${margins7.left},0)`)
      .call(d3.axisLeft(y7).tickSize(0))
      .call((g) => g.select(".domain").remove())
      ;
const squares = svg7.selectAll()
                   .data(data7, d => d.category + ":" + d.year)
                   .join('rect')
                   .attr("x", d => x7(d.year))
                   .attr("y", d => y7(d.category))
                   .attr("rx", 5)
                   .attr("ry", 5)
                   .attr("width", x7.bandwidth())
                   .attr("height", y7.bandwidth())
                   .style("fill", d => color7(d.percentage))
                   .style("stroke-width", 4)
                   .style("stroke", "none")
                   .style("opacity", 0)
        squares.transition()
                   .duration(1000)
                   .delay((d, i) => i * 10)
                   .style("opacity", 1);
                  
        //tooltip
        const tooltip7 = svg7.append("g")
        .style("display", "none")
        .style("pointer-events", "none");

        const tooltipPath = tooltip7.append("path")
        .attr("fill", "white")
        .attr("stroke", "black");

        const tooltipText = tooltip7.append("text")
        .attr("font-size", "12px")
        .attr("font-family", "Roboto, sans-serif");


    squares
    .on("mouseover", function(e, d){

      const [xm, ym] = d3.pointer(e)
      
      d3.select(this)
        .style("stroke", "black")
        

      tooltip7
      .style("display", null)
      .attr("transform", `translate(${xm - 4},${ym + 3})`);

      tooltipText.text(`${d.category}: ${d.percentage}%`);
       size(tooltipText, tooltipPath);

    })
    .on("mousemove", function(e, d){
     
      const [xm, ym] = d3.pointer(e)

      d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke", "black")
      
      tooltip7.attr("transform", `translate(${xm - 4},${ym + 3})`);
      tooltipText.text(`${d.category}: ${d.percentage}%`);
      size(tooltipText, tooltipPath);
    })
    .on("mouseleave", function(e, d){
      
      d3.select(this)
        .style("stroke", "none")

      tooltip7
          .style("display", "none")
    });



function size(text, path) {
    const {x, y, width: w, height: h} = text.node().getBBox();
    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10}, 5H-5l5, -5l5, 5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
  }

const highlightLabels = [
  { category: "Agency costs", year: "2024" },
  { category: "Commission", year: "2024" },
  { category: "Travel costs", year: "2019" },
  { category: "Magazine for students", year: "2024" },
  { category: "Magazine for students", year: "2019" },
  { category: "Publicity costs", year: "2014" }
];

svg7.selectAll("text.square-label")
  .data(data7.filter(d => highlightLabels.some(h => h.category === d.category && h.year === d.year)))
  .enter()
  .append("text")
  .attr("x", d => x7(d.year) + x7.bandwidth() / 2)
  .attr("y", d => y7(d.category) + y7.bandwidth() / 2)
  .attr("text-anchor", "middle")
  .attr("dy", "0.35em")
  .attr("font-size", "12px")
  .attr("font-family", "Roboto, sans-serif")
  .attr("fill", "black")
  .attr("opacity", 0)
  .text(d => `${d.percentage}%`)
  .transition()
  .duration(1000)
  .delay((d, i) => i * 300)
  .attr("opacity", 1);

// Add a title
  const title = svg7.append("g")
      .append("text")
      .attr("x", width7 / 2)
      .attr("y", (margins7.top / 2 - 5))
      .attr("text-anchor", "middle")
      .attr("front-weight", "bold")
      .attr("font-family", "Roboto, sans-serif")
      .attr("font-size", "20px")
      .text("Marketing spend by category 2014-2024");
   
    const legendWidth = 300;
    const legendHeight = 10;
    const legendMarginTop = 20;

    // Define gradient
    const defs = svg7.append("defs");
    const linearGradient = defs.append("linearGradient")
    .attr("id", "legend-gradient");

    linearGradient.selectAll("stop")
    .data(d3.ticks(0, 1, 10))
    .enter()
    .append("stop")
    .attr("offset", d => `${d * 100}%`)
    .attr("stop-color", d => d3.interpolatePlasma(d));

    // Add gradient bar
    svg7.append("rect")
    .attr("x", width7 / 2 + legendWidth / 2)
    .attr("y",  legendMarginTop + 50)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

    // Add axis for the legend
    const legendScale = d3.scaleLinear()
    .domain(color7.domain())
    .range([width7 / 2 - legendWidth / 2, width7 / 2 + legendWidth / 2]);

    svg7.append("g")
    .attr("transform", `translate(302, ${legendMarginTop +50 + 10})`)
    .call(d3.axisBottom(legendScale).ticks(5).tickFormat(d => `${d}%`))
    .call(g => g.selectAll("text").style("fill", "#c9c6c6"))
    .call(g => g.selectAll("line").style("stroke", "#c9c6c6"))
    .select(".domain").remove();

