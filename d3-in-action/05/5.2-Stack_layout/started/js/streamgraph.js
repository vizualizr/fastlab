const drawStreamGraph = (data) => {
  // Generate the streamgraph here
  // started on 2026-08-24

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  const svg = d3
    .select("#streamgraph")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  // chart container <g> created
  // innerChart: d3.Selection
  const innerChart = svg
    .append("g")
    .attr("class", "chart-container")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // stack data generator created
  // init the generator with the given keys.
  // keys: Array<String>

  const stackDataGenerator = d3.stack().keys(formatsInfo.map((f) => f.id));

  // Now stackDataGenerator generates a stacked layout data with the given data.
  // data: Array<Object>

  const stackData = stackDataGenerator(data);

  // stackData[stackData.length-1] is the top-most series among the streams
  // so the max value out of the top-most series will have the top-most y coordinates.
  const topMostPoint = d3.max(stackData[stackData.length - 1], (d) => d[1]);

  const yScale = d3
    .scaleLinear()
    .domain([0, topMostPoint])
    .range([innerHeight, 0])
    .nice();

  // area generator generates the areas by Series.
  // @parameter stackData
  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.data.year) + xScale.bandwidth() / 2)
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const areaSelected = innerChart
    .append("g")
    .attr("class", "areas-container")
    .selectAll("path")
    .data(stackData)
    .join("path")
    .attr("d", areaGenerator)
    .attr("fill", (d) => colorScale(d.key));

  console.log("areaSelected: ", areaSelected);
};
