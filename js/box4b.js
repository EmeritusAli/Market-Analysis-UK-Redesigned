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
