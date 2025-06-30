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

