// const { default: label } = require("flyonui/components/label");
// 2025-11-07 Under revision
// This file includes the content of 3.5 Adding labels to a chart

// Append a SVG container
const containerWidth = 768;
const containerHeight = containerWidth;
const paddingLeft = 125;
const paddingRight = 50;
let tally = 0;
const svg = d3
  .select(".svg-container")
  .append("svg")
  .attr("viewBox", `0 0 ${containerWidth} ${containerWidth}`);
// .style("border", "1px solid silver");

// Load, format and measure the dataset
d3.csv("./data/data.csv", (d) => {
  // Format the dataset
  return {
    technology: d.technology,
    count: +d.count,
  };
}).then((data) => {
  // Log the full dataset
  // console.log(data);

  // How many rows the dataset contains
  console.log(data.length); // => 33
  tally = data.length;

  // Get the max and min values
  console.log(d3.max(data, (d) => d.count)); // => 1078
  console.log(d3.min(data, (d) => d.count)); // => 20

  // 이 데이터셋이 단순한 숫자 배열이 아니라 객체 배열인 경우, d3.extent()는 각 객체(datum) 내에서 어떤 '키(key)'의 값을 기준으로 최솟값과 최댓값을 찾을지 알아야 한다. 따라서 d3.extent(data)로 쓰지 않는다. data는 각 원소가 객체인 배열 객체이기 때문이다.
  console.log(d3.extent(data, (d) => d.count)); // => [20, 1078]

  // Sort the data in descending order
  data.sort((a, b) => b.count - a.count);

  // Pass the data to another function
  render(data);
});

// Create the bar graph
const render = (data) => {
  // Use data-binding to append rectangles
  const barHeight = containerWidth / tally;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)])
    .range([0, containerWidth - paddingRight - paddingLeft]);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.technology))
    .range([0, containerHeight])
    .padding(0.1);

  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate (0, ${yScale(d.technology)})`);

  barAndLabel
    .append("rect")
    .attr("width", (d) => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("x", paddingLeft)
    .attr("y", 0)
    .attr("fill", (d) =>
      d.technology === "D3.js" ? "yellowgreen" : "skyblue"
    );
  barAndLabel
    .append("text")
    .text((d) => d.technology)
    .attr("x", paddingLeft * 0.975)
    .attr("y", "1.25em")
    .attr("class", "bar-label")
    .attr("text-anchor", "end");

  barAndLabel
    .append("text")
    .text((d) => d.count)
    .attr("x", (d) => xScale(d.count) + paddingLeft * 1.03)
    .attr("y", "1.25em")
    .attr("class", "bar-count")
    .attr("text-anchor", "start");

  svg
    .append("line")
    .attr("class", "y-axis")
    .attr("x1", paddingLeft)
    .attr("y1", 0)
    .attr("x2", paddingLeft)
    .attr("y2", containerHeight);

  // svg
  //   .selectAll("rect")
  //   .data(data)
  //   .join("rect")
  //   .attr("class", (d) => {
  //     console.log(d);
  //     return `bar bar-${d.technology}`;
  //   })
  //   .attr("width", (d) => xScale(d.count))
  //   .attr("height", yScale.bandwidth())
  //   .attr("x", paddingLeft)
  //   // .attr("y", (d, i) => (barHeight + 5) * i)
  //   .attr("y", (d) => yScale(d.technology))
  //   .attr("fill", (d) =>
  //     d.technology.toLowerCase().includes("python") ? "yellowgreen" : "skyblue"
  //   );
};
