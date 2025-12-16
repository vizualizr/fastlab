// Append a SVG container
const svg = d3
  .select(".graph")
  .append("svg")
  // viewBox는 반드시 지정해야 한다.
  .attr("viewBox", "0 0 1200 1600")

// Load, format and measure the dataset
d3.csv("data/data.csv", (d) => {
  // Format the dataset
  return { technology: d.technology, count: +d.count,};
  //  여기서 전달하는 data는 자바스트립트 표준 배열이다. 이 배열은 위에서 반환받은 객체를 원소로 한다.
}).then((data) => {
  // Log the full dataset
  // console.log(data);

  // How many rows the dataset contains
  console.log(data.length, " rows"); // => 33

  // Get the max and min values
  console.log(d3.max(data, (d) => d.count)); // => 1078
  console.log(d3.min(data, (d) => d.count)); // => 20
  console.log(d3.extent(data, (d) => d.count)); // => [20, 1078]

  // Sort the data in descending order
  data.sort((a, b) => b.count - a.count);

  // Pass the data to another function
  createViz(data);
});

// settings
const barHeight = 20;
const barGap = 2;

// Create the bar graph
const createViz = (data) => {
  // empty selection
  let s = svg.selectAll("rect");
  console.log("before");
  console.log(s);
  svg
    .selectAll() // 일단 빈 Selection 객체를 반환해서
    .data(data) // 거기에 data를 전달하면
    .join("rect") // 
    .attr("class", (d) => {
      console.log(d);
      return `bar bar-${d.technology}`;
    })
    .attr("width", (d) => d.count)
    .attr("height", barHeight)
    .attr("x", 0)
    .attr("y", (d, i) => (barHeight + barGap) * i)
    .attr("fill", (d) => d.technology ==="D3.js" ? "orange" : "silver");

      console.log("after");
      s = svg.selectAll("rect");
      console.log(s.);

};
