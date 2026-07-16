const drawStackedBars = (data) => {
  // Generate the stacked bar chart here

  /*******************************/
  /*    Append the containers    */
  /*******************************/

  // returns svg: Selection object
  const svg = d3
    .select("#bars")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const streamgraphKeys = formatsInfo.map((f) => f.id);
  console.log("streamgraphKeys", streamgraphKeys);
  // [
  //     "vinyl",
  //     "eight_track",
  //     "cassette",
  //     "cd",
  //     "download",
  //     "streaming",
  //     "other"
  // ]

  // A declaration of function object generated annotated data
  const stackGenerator = d3.stack().keys(streamgraphKeys);

  // An annotated data based on the key value, format name, such as vinyl
  // 이제 format에 해당하는 데이터를 stack한다.
  const annotatedData = stackGenerator(data);

  // [ formats
  //   [ years
  //     [ 1973
  //       0: lower boundary
  //       1: upper boundary
  //     ]
  //   ]
  // ]

  console.log("annotated data", annotatedData);
  // console.log("annotated data", JSON.stringify(annotatedData, null, 2));

  // 계산한 annotatedData에 있는 가장 마지막 값에서
  // 접근자 함수로 접근한 값 가운데 최대값을 찾는다.
  const maxUpperBoundary = d3.max(
    annotatedData[annotatedData.length - 1],
    (d) => d[1],
  );

  // 위에서 얻은 최대값으로
  // annotatedData의 값을 그래프 위의 y 좌표로 변환할 수 있는
  // 척도를 정의한다.
  const yScale = d3
    .scaleLinear()
    .domain([0, maxUpperBoundary])
    .range([innerHeight, 0])
    .nice();

  annotatedData.forEach((series) => {
    innerChart
      .selectAll(`.bar-${series.key}`)
      .data(series)
      .join("rect")
      .attr("class", (d) => `bar-${series.key}`)
      .attr("x", (d) => xScale(d.data.year))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("fill", colorScale(series.key));
  });
};
