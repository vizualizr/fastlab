
// Load both the chart data and the locale data together
Promise.all([
  d3.csv("data/weekly_temperature.csv", d3.autoType),
  d3.json("/d3-in-action/asset/ko-KR.json")
]).then(([data, koKR]) => {
  if (data && koKR) {
    console.log("temperature data", data);
    console.log("locale data", koKR);
    // 실제 차트는 여기서부터 그린다.
    drawLineChart(data, koKR);
  } else {
    console.error("데이터 또는 로케일 로드 실패");
  }
}).catch(error => {
  console.error("로드 중 오류 발생:", error);
});

// Create the line chart here
const drawLineChart = (data) => {
  // 1. Organize the room for chart
  //
  const width = 800;
  const height = width / 2;
  const margin = {
    top: 40,
    bottom: 25,
    right: 170,
    left: 40,
    get horizontalMargin() {
      return this.right + this.left;
    },
    get verticalMargin() {
      return this.top + this.bottom;
    },
  };
  const innerWidth = width - margin.horizontalMargin;
  const innerHeight = height - margin.verticalMargin;
  const svg = d3
    .select("#line-chart")
    .append("svg")
    .attr("viewBox", `0, 0, ${width}, ${height}`);

  // 2. now, chart has margin on 4 sides, and it's adjustable.
  //
  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 3. Preparing the x, y scales to use them in x, y axis
  //
  // this is to enforce the first tick starting from January.
  // raw 데이터에서 가장 빠른 날짜를 받아와서
  const firstDateRaw = d3.min(data, (d) => d.date);
  // 해당 년도의 1월로 새로운 Date 객체를 만들고, 
  const firstDate = new Date(firstDateRaw.getFullYear(), 0, 1, 0, 0, 0);
  // 마지막 날짜는 raw 데이터에서 가장 마지막 날짜를 받아옴.
  const lastDate = d3.max(data, (d) => d.date);
  // then the scale is as below.
  // 그러면 첫 tick이 언제나 1월 1일로 시작하는 
  // 스케일 객체를 생성할 수 있음
  // 이 걸 축 객체에서 call()로 불러오면 됨.
  // xScale은 날짜 기준 척도이므로
  // 눈금 간격이 각 달의 날짜수에 따라 미세하게 다름
  const xScale = d3
    .scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

  // “Because vertical values are calculated from top to bottom in the SVG coordinate system, the range starts at innerHeight, the position of the bottom-left corner of the inner chart, and ends at 0, the position corresponding to its top-left corner:”
  // zotero://select/library/items/VHTGXJRT

  const maxTemp = d3.max(data, (d) => d.max_temp_F);
  const yScale = d3.scaleLinear().domain([0, maxTemp]).range([innerHeight, 0]);

  // 4. Construct a bottomAxis with the populated xScale.
  //
  // xScale에서 정의역(domain)
  const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

  const leftAxis = d3.axisLeft(yScale);
  // 생성한 축을 DOM 요소 렌더링 하기 위해 호출한다. 
  chart.append("g").attr("class", "axis-x").call(bottomAxis);
  // chart.append("g").attr("class", "axis-y").call(leftAxis);

  d3.selectAll('.axis-x text')
    .attr("x", d => {
      console.log(d);
      const currentMonth = d;
      const nextMonth = new Date(firstDateRaw.getFullYear(), currentMonth.getMonth() + 1, 1);
      return (xScale(nextMonth) - xScale(currentMonth)) / 2;
    })
    .attr("y", "1.5rem")
    .style("font-family", "Roboto")
    .style("font-size", "1.3rem");
};
