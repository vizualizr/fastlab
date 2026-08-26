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

  const graphKeys = formatsInfo.map((f) => f.id);
  console.log("graphKeys", graphKeys);
  // [
  //     "vinyl",
  //     "eight_track",
  //     "cassette",
  //     "cd",
  //     "download",
  //     "streaming",
  //     "other"
  // ]

  // 1. A declaration of function object generated annotated data
  // 2. then init the generator with the keys, graphKeys
  const stackDataGenerator = d3.stack().keys(graphKeys);

  // An annotated data based on the key value, format name, such as vinyl
  // 이제 format에 해당하는 데이터를 stack한다.
  const stackData = stackDataGenerator(data);

  // [ formats
  //   [ years
  //     [ 1973
  //       0: lower boundary
  //       1: upper boundary
  //     ]
  //   ]
  // ]

  console.log("stack data", stackData);

  // console.log("annotated data", JSON.stringify(annotatedData, null, 2));

  // 계산한 annotatedData에 있는 가장 마지막 값에서
  // 접근자 함수로 접근한 값 가운데 최대값을 찾는다.
  // 이게 가능한 이유는 아래와 같다.
  // annnoatedData는 계열 순서대로 그리니까 제일 마지막 원소는
  // 제일 위에 있는 계열값을 저장하고 있다.
  const maxUpperBoundary = d3.max(
    stackData[stackData.length - 1],
    (d) => d[1],
  );
  console.log("maxUpperBoundary: ", maxUpperBoundary);

  // 위에서 얻은 최대값으로
  // annotatedData의 값을 그래프 위의 y 좌표로 변환할 수 있는
  // 척도를 정의한다.
  const yScale = d3
    .scaleLinear()
    .domain([0, maxUpperBoundary])
    .range([innerHeight, 0])
    .nice();

  stackData.forEach((series) => {
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

  const yearRange = d3.range(
    stackData[0][0].data.year,
    stackData[0][stackData[0].length - 1].data.year + 1,
    2,
  );
  const bottomAxisGenerator = d3
    .axisBottom(xScale)
    .tickValues(yearRange)
    .tickFormat((d) => {
      if (
        d === yearRange[0] ||
        d === yearRange[yearRange.length - 1] ||
        d === 2000 ||
        d === 2001
      ) {
        return d;
      } else {
        return d.toString().slice(-2); // 그 외에는 뒤의 2자리만 잘라서 출력 [3, 4]
      }
    });

  innerChart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxisGenerator)
    .selectAll(".tick text")
    .attr("class", "font-bold font-roboto-condensed"); // css에 tailwind를 불러온 상태라 사용 가능한 거다.

  const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
    .call(leftAxis)
    .attr("class", "text-lg font-bold font-roboto-condensed");
};
