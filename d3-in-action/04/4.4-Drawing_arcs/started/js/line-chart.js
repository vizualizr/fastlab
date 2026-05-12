// console.log("Ran on " + new Date());
let tik = performance.now();

function showElapsedTime(stepName) {
  const duration = ((performance.now() - tik) / 1000).toFixed(4);
  const suffix = stepName ? ` -> ${stepName} completed` : "";
  console.log(`${duration}s ${suffix}`);
  tik = performance.now();
}

const aubergine = "red";
const paperBG = "#e7e2cd";

// Load the data here
Promise.all([
  d3.csv("data/weekly_temperature.csv", d3.autoType),
  d3.csv("data/daily_precipitations.csv", d3.autoType),
  d3.json("/d3-in-action/asset/ko-KR.json"),
])
  .then(([data, data2, koKR]) => {
    if (data && data2 && koKR) {
      console.log("> temp data loaded ", data);
      // 강우 데이터를 모두 불러오면 아래처럼 데이터를 출력한다.
      console.log("> precipitations data loaded ", data2);
      console.log("> locale data ", koKR);

      // ---------- loading completed
      showElapsedTime("loading");

      drawLineChart(data);
      drawArcChart(data2);
    } else {
      console.log("Resource found but the error with the response.");
      console.error("Loading failed");
    }
  })
  .catch((error) => {
    console.log("Either of files is not found");
    console.error();
  });

// --------------------------------------
// Plot the line chart with the given data
// --------------------------------------
const drawLineChart = (data) => {
  /*******************************/
  /*    Declare the constants    */
  /*******************************/

  const width = 1000;
  const height = (width / 3) * 2;
  const margin = {
    top: 55,
    bottom: 55,
    left: 55,
    right: 170,
    get horizontal() {
      return this.left + this.right;
    },
    get vertical() {
      return this.top + this.bottom;
    },
  };

  const innerWidth = width - margin.horizontal;
  const innerHeight = height - margin.vertical;

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  //
  // Append the SVG container
  const strokeWidth = 0;
  const renderedWidth = width + strokeWidth / 2;
  const svg = d3
    .select("#line-chart")
    .append("svg")
    .attr("viewBox", `0, 0, ${renderedWidth}, ${height}`);

  svg
    .append("rect")
    .attr("width", width - strokeWidth)
    .attr("height", height - strokeWidth)
    .attr("x", strokeWidth / 2)
    .attr("y", strokeWidth / 2)
    .attr("fill", paperBG)
    .attr("stroke", "black")
    .attr("stroke-width", strokeWidth);

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const innerChartBG = innerChart
    .append("rect")
    .attr("class", "innerChartBG")
    .attr("width", `${innerWidth}`)
    .attr("height", `${innerHeight}`)
    .attr("fill", paperBG);

  /****************************/
  /*    Declare the scales    */
  /****************************/
  // X scale
  const firstDate = new Date(2021, 00, 01, 0, 0, 0);
  const lastDate = d3.max(data, (d) => d.date);
  const xScale = d3
    .scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

  // Y scale
  const minTemp = d3.min(data, (d) => d.min_temp_F);
  const maxTemp = d3.max(data, (d) => d.max_temp_F);
  const maxYScale =
    Math.ceil((d3.max(data, (d) => d.max_temp_F) + minTemp) / 10) * 10;
  console.log("minTemp: ", minTemp);
  console.log("maxTemp: ", maxTemp);
  const yScale = d3
    .scaleLinear()
    .domain([0, maxYScale])
    .range([innerHeight, 0]);

  /***************************/
  /*     ADD DOTS
  /***************************/

  // const aubergine = "#75485E";

  /***************************/
  /*     ADD AREA
  /***************************/

  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.date))
    .y0((d) => yScale(d.max_temp_F))
    .y1((d) => yScale(d.min_temp_F))
    .curve(d3.curveCatmullRom);

  innerChart
    .append("path")
    .attr("class", "area-temp")
    .attr("d", areaGenerator(data))
    .attr("fill", "white")
    .attr("fill-opacity", 1)
    .attr("stroke", "#9a9789")
    .attr("stroke-width", 1);

  /***************************/
  /*     ADD LINES
  /***************************/

  // 선을 그리는 함수 객체를 먼저 생성한다.
  // d3.line()은 접근자 함수를 이용해 함수 객체를 생성해 반환한다.
  const straightLineGenerator = d3
    .line()
    .x((datum) => xScale(datum.date))
    .y((datum) => yScale(datum.avg_temp_F));

  const curvedLineGenerator = d3
    .line()
    .x((datum) => xScale(datum.date))
    .y((datum) => yScale(datum.avg_temp_F))
    .curve(d3.curveCatmullRom); //선을 그리는 함수 객체에 체이닝을 추가하면 선 모양을 곡선으로 만든다.

  // 직선을 먼저 추가한다.
  // SVG 요소인 path를 추가하고
  // 앞서 선언한 선 생성 함수 객체 straightLineGenerator로
  // path 요소의 속성 d에 값을 할당한다.
  innerChart
    // 새로운 그룹 요소를 추가해 path의 위치를 지정한다.
    .append("g")
    .attr("class", "straight-line")
    // path 요소를 추가한다.
    .append("path")
    // lineGenerator로 생성한 선 그리기 명령을 path 요소의 속성 d에 할당한다.
    .attr("d", straightLineGenerator(data))
    // SVG 요소는 생성 직후 검은색으로 내부 색을 지정하므로 이를 지운다.
    .attr("fill", "none")
    // 선의 색을 지정한다.
    .attr("stroke", "red");

  // 동일한 방식으로 곡선을 그린다.
  innerChart
    .append("g")
    .attr("class", "curved-line")
    .append("path")
    .attr("d", curvedLineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "blue");

  // 마지막으로 점을 그린다.
  const rectWidth = 6;
  innerChart
    .append("g")
    // 보통은 'rect'를 호출하지만
    // 차후 해당 SVG 안에 또 다른 rect 요소가 반복되는 상황을 가정해
    // 클래스 기반으로 참조를 변경한다.
    .attr("class", "avg-dots")
    .selectAll(".avg-dot")
    .data(data)
    .join("rect")
    .attr("class", "avg-dot")
    .attr("width", rectWidth)
    .attr("height", rectWidth)
    .attr("x", (d) => xScale(d.date) - rectWidth / 2)
    .attr("y", (d) => yScale(d.avg_temp_F) - rectWidth / 2)
    .attr("fill", "black")
    .attr("opacity", 0.33);

  // ---------- loading completed

  /***************************/
  /*     Append the labels   */
  /***************************/
  // 간단하게 코드양을 줄이려면,
  // 특정 날짜와 레이블의 위치를 입력받아
  // 날짜에 해당하는 점에서 위 혹은 아래로 선을 그리고
  // 거기에 레이블을 추가하는 함수를 만들 수도 있다.
  /*   label - Highest temperature w/ line  */
  innerChart
    .append("text")
    .text("Highest temperature")
    .attr("class", "label-max-temp")
    .attr("x", xScale(data[data.length - 4].date) + 15)
    .attr("y", yScale(data[data.length - 4].max_temp_F) - 20)
    .attr("fill", "black");

  innerChart
    .append("line")
    .attr("x1", xScale(data[data.length - 4].date))
    .attr("y1", yScale(data[data.length - 4].max_temp_F) - 2)
    // 위에서 추가한 DOM 객체의 x, y 좌표를 그대로 받아서 적용한다.
    // d3.js in action 에서는 텍스트 요소와 같은 방식으로 x, y 좌표를 다시 한 번 계산한다.
    .attr("x2", +innerChart.select(".label-max-temp").attr("x") - 2)
    .attr("y2", +innerChart.select(".label-max-temp").attr("y") - 2)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  /*   label - average temperature   */
  innerChart
    .append("text")
    .text("Average temperature")
    .attr("class", "label-avg-temp")
    .attr("x", xScale(data[data.length - 1].date) + 10)
    .attr("y", yScale(data[data.length - 1].avg_temp_F))
    .attr("fill", "black")
    .attr("dominant-baseline", "middle");

  /*   label - lowest temperature w/ line  */
  innerChart
    .append("text")
    .text("Lowest temperature")
    .attr("class", "label-min-temp")
    .attr("x", xScale(data[data.length - 3].date) + 15)
    .attr("y", yScale(data[data.length - 3].min_temp_F) + 20)
    .attr("fill", "black")
    .attr("dominant-baseline", "hanging");

  innerChart
    .append("line")
    .attr("x1", xScale(data[data.length - 3].date))
    .attr("y1", yScale(data[data.length - 3].min_temp_F) + 2)
    .attr("x2", +innerChart.select(".label-min-temp").attr("x") - 2)
    .attr("y2", +innerChart.select(".label-min-temp").attr("y") - 2)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  /***************************/
  /*     Append the axes     */
  /***************************/
  // Bottom axis
  const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

  innerChart
    .append("g")
    .attr("class", "axis-x")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  d3.selectAll(".axis-x text")
    .attr("x", (d) => {
      const currentMonth = d;
      const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
      return (xScale(nextMonth) - xScale(currentMonth)) / 2;
    })
    .attr("y", "0.85em");

  // Left axis
  const leftAxis = d3.axisLeft(yScale);
  innerChart.append("g").attr("class", "axis-y").call(leftAxis);
  d3.selectAll(".axis-y text").attr("x", "-0.85em");

  // Set the font-family and font-size property of axis labels
  // This could also be handled from a CSS file
  d3.selectAll(".axis-x text, .axis-y text")
    .style("font-family", "Roboto, sans-serif")
    .style("font-size", "1.4em");

  // Add label to the y-axis
  svg.append("text").text("Temperature (°F)").attr("y", 20);

  showElapsedTime("Plotting line chart");
};

// --------------------------------------
// Plot the arc chart with the given data
// --------------------------------------
const drawArcChart = (data) => {
  showElapsedTime("Plotting arc init");
  showElapsedTime("Plotting arc");

  const pieChartWidth = 500;
  const pieChartHeight = pieChartWidth;
  const arcChart = d3
    .select("#arc")
    .append("svg")
    .attr("viewBox", `0, 0, ${pieChartWidth}, ${pieChartHeight}`);
  // svg객체의 크기를 viewBox로 정의한다.
  // 반응형 웹에서 해당 요소는 viewBox에 정의한 가로 세로 비율을 유지한다.

  arcChart
    .append("rect")
    .attr("width", pieChartWidth)
    .attr("height", pieChartHeight)
    .attr("fill", paperBG);
  // .style("opacity", 0.01);
  const innerChart = arcChart
    .append("g")
    .attr(
      "transform",
      `translate (${pieChartWidth / 2}, ${pieChartHeight / 2})`,
    );

  const numberOfDays = data.length;
  const numberOfDaysWithPrecip = data.filter(
    (d) => d.total_precip_in > 0,
  ).length;
  const percentageDaysWithPrecip = Math.round(
    (numberOfDaysWithPrecip / numberOfDays) * 100,
  );

  console.log("Precip percentage", percentageDaysWithPrecip);

  const angleInDeg = (360 * percentageDaysWithPrecip) / 100;
  const angleInRad = (angleInDeg * Math.PI) / 180;

  console.log("Precip percentage in RAD", angleInRad);

  // 원호 생성기를 선언해 원호를 그릴 객체 함수를 준비한다.
  // 객체 함수에 접근자 함수를 추가하면 원호의 모양을 지정할 수 있다.
  // 아래 네 속성은 정적 바인딩으로 선언한 상태이다. 
  // 해당 속성 모두를 path 요소 추가 시점에 동적으로 바인딩하는 것 또한 가능하다.
  // 이 예시처럼 혼합형으로 바인딩하는 것도 가능하다.
  const arcGenerator = d3
    .arc() // 생성자 함수를 생성한다.
    .innerRadius(90) // 호의 안지름을 지정한다
    .outerRadius(180) // 호의 바깥지름을 지정한다
    .padAngle(0) // 중심축 한 개에 여러 개의 호가 이어질 때 호 사이의 간격을 정한다.
    // .cornerRadius(0); // 각 호의 시작과 끝에 있는 모서리에 내접하는 원의 반지름을 정한다.
    // 위 값이 커지면 모서리가 완만하고 작아지면 날카롭게 된다.


  innerChart
    .append("path") // 호를 그릴 SVG Path 요소를 추가하고
    .attr("d", () => { // 속성 d를 추가한다.
      return arcGenerator({ // 호 생성 함수 arcGenerator가 아래 지시에 따라 속성 d에 들어갈 값을 생성한다.
        startAngle: 0, // 호가 시작하는 각도를
        endAngle: angleInRad, // 호가 끝나는 각도를 지정한다.
      }); // D3 arc()객체 형식으로 전달한다. 
    })
    .attr("fill", "#4d4b44");

  innerChart
    .append("path")
    .attr("d", () => {
      return arcGenerator({
        startAngle: angleInRad,
        endAngle: 2 * Math.PI
      });
    })
    .attr("fill", "#b3b0a0");
};
