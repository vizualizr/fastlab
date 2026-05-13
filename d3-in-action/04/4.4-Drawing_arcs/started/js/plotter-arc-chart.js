import { COLORS } from "./utils.js";
const aubergine = COLORS.aubergine;
const paperBG = COLORS.paperBG;

// --------------------------------------
// Plot the arc chart with the given data
// --------------------------------------
export function drawArcChart(data) {
  // showElapsedTime("Plotting arc init");
  // showElapsedTime("Plotting arc");

  console.log(typeof data[0].date);
  console.log(typeof data[0].total_precip_in);

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
    .padAngle(0); // 중심축 한 개에 여러 개의 호가 이어질 때 호 사이의 간격을 정한다.
  // .cornerRadius(0); // 각 호의 시작과 끝에 있는 모서리에 내접하는 원의 반지름을 정한다.
  // 위 값이 커지면 모서리가 완만하고 작아지면 날카롭게 된다.

  innerChart
    .append("path") // 호를 그릴 SVG Path 요소를 추가하고
    .attr("d", () => {
      // 속성 d를 추가한다.
      return arcGenerator({
        // 호 생성 함수 arcGenerator가 아래 지시에 따라 속성 d에 들어갈 값을 생성한다.
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
        endAngle: 2 * Math.PI,
      });
    })
    .attr("fill", "#b3b0a0");
}
