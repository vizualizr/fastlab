// ========== SVG CONTAINER DECLARATION ==========
// ==================================================
// Last updated on 2026-04-24T00:30:51.5400000+08:00

const svg = d3
  .select(".graph") // 이미 존재하는 DOM 요소인 graph에
  .append("svg") // 그래프가 들어갈 자리(svg)를 마련한다.
  .attr("viewBox", "0 0 1200 1600");
// viewBox는 반드시 지정해야 한다.

// ========== 1 DATA LOADER ==========
// ==================================================
// 원시데이터를 불러온 뒤 바로 자료형 변환을 적용한다.

//
// ========== 2.1 FORMATTING - ROW BASIS ==========
//
console.log("========== 2.1 FORMATTING - ROW BASIS ==========");
console.log("> Starting line by line raw data verification.");

d3.csv(
  "data/data.csv",
  // dsv 함수로 불러오는 원시데이터는 표 형식이어야 한다.
  // dsv 함수는 d3 fetch 모듈의 일부이다.
  // 해당 모듈은 자바스크립트 Fetch API의 래퍼 함수(wrapper function)이다.

  (d, i) => {
    // 인자로 전달하는 화살표 함수( (d) => {})는 함수 객체이다.
    // 함수 객체는 불러온 원시데이터의 각 행마다 적용된다.

    console.log(`RAW Data line no. ${i}`, d);

    // d3는 각 행마다 원하는 서식을 적용해 JS 객체(json객체 아님)로 반환한다.
    return {
      technology: d.technology,
      count: +d.count,
    };
  },
  //
  // d3는 위에서 자료형 변환을 모든 행에 적용한 뒤
  // 각 행마다 하나씩 생성한 JS 객체를 원소로 하는 배열 하나를 생성한다.
  // 해당 배열 객체를 아래처럼 then()으로 연결(chaining)해 전달한다.
  // 해당 배열은 자바스크립트 표준 배열이다.
  //
).then((data) => {
  //
  // ========== 2.2 MEASURING - DATASET BASIS ==========
  //
  // 여기서부터는 데이터집합 전체를 다룬다.
  // 데이터집합과 가시화 요소를 일치시키려면
  // 데이터집합의 특성을 알아야 한다.
  // 크기, 최대/최소값/산술평균 등이 여기에 해당한다.

  // Log the full dataset
  console.log("========== 2.2 MEASURING - DATASET BASIS ==========");

  // How many rows the dataset contains
  console.log("> Dataset has ", data.length, " rows"); // => 33

  // return the min and the max from the given data
  console.log(
    "> The maximum value in the dataset is ",
    d3.max(data, (d) => d.count),
  ); // => 1078
  console.log(
    "> The minimum value in the dataset is ",
    d3.min(data, (d) => d.count),
  ); // => 20
  // return an array with min and max of the given data
  console.log(
    "> d3.extent() returns a pair of d3.min() and d3.max() as ",
    d3.extent(data, (d) => d.count),
  ); // => [20, 1078]

  // Sort the data in descending order
  data.sort((a, b) => b.count - a.count);

  console.log("> Dataset is ready to visualize");
  console.log(data);
  // Pass the data to another function
  createViz(data);
});

// settings
const barHeight = 20;
const barGap = 2;

//
// ========== 3. BINDING ==========
// 데이터 집합과 DOM 기반의 시각적 요소를 대응시키는 과정이다.
const createViz = (data) => {
  //
  // d3가 데이터집합을 DOM 요소에 주입하는 과정을 단계별로 확인하기 위해
  // Selection 객체를 저장할 변수 두 개,
  // 즉 emptySelection과 filledSelection을 선언한다.
  // emptySelection에서는 data에 DOM 요소를 주입하기 전
  // Selection 객체에 데이터집합, 즉 JS 배열인
  // data만 추가한 상태를 확인한다.
  //
  const emptySelection = svg.selectAll("rect").data(data);
  console.log("> what's in svg now? ");
  console.log(emptySelection.size());
  console.log(emptySelection);
  // emptySelection은 Selection 객체이며 data에 대응하는 DOM을 기다리는 상태다.
  // 이 상태는 해당 객체 아래 두 개의 배열에서 확인할 수 있다.
  // _enter: [Array(33)]
  // 배열 _enter는 대기열이다. 대응하는 DOM이 없는 데이터 요소의 목록이다.
  // 즉 data(myData) 뒤에 체이닝으로 지정할 DOM 요소와 짝맞춤해야 하는 목록이다.
  // _exit: [Array(0)]
  // 배열 _exit에는 현재 Selection과 비교해 화면에 표시될 필요가 없는 DOM 목록이다.
  // 기존에 그린 DOM 요소가 없는 상황이므로 _exit 배열의 길이는 0이다.

  // 변수 filledSelection에서는 data의 각 원소를
  // "rect"라는 SVG 요소에 주입한 후의 상태를 관찰할 수 있다.
  // 해당 작업은 join("rect")이 통제한다.
  // filledSelection에는 데이터와 DOM 요소 두 집합의 짝맞춤을 마친 상태의
  // Selection 객체를 저장한다.
  const filledSelection = emptySelection
    .join("rect") // 이 한 줄로 데이터 집합에 DOM 할당이 끝난다.
    // 할당이 끝난 각 요소쌍(datum과 각 rect 요소)에 개별적으로 접근해 속성을 지정한다.
    .attr("width", (d) => d.count) 
    .attr("height", barHeight)
    .attr("x", 0)
    .attr("y", (d, i) => (barHeight + barGap) * i)
    .attr("fill", (d) => (d.technology === "D3.js" ? "orange" : "silver"));
  console.log(filledSelection.size());
  console.log(filledSelection);

  // join()이 끝난 Selection객체에 실제 여러가지를 조작하면
  // _groups를 참조해서 수행한다
};
