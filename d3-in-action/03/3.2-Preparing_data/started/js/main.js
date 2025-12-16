// Append a SVG container
const svg = d3
  .select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1200 1600")
  .style("border", "1px solid black");

d3.csv("data/data.csv", (d) => {
  // 여기 d값은 csv의 각 행이다. 즉 개별 데이터다.
  // console.log(`iteration is ${JSON.stringify(d)}`);
  // 따라서 아래의 반환값은 각 행을 JSON 객체로 변환해 반환하는 구문이다.
  if (+d.count > 99) {
    return {
      technology: d.technology,
      // +는 인자를 형변환한다.
      // 반환값은 number이다. int와 float를 포괄한다.
      count: +d.count,
    };
  }
}).then((data) => {
  console.log("file has loaded.");
  console.log(
    "max; ",
    d3.max(data, (d) => d.count)
  );
  console.log(
    "min; ",
    d3.min(data, (d) => d.count)
  );
  data.sort((first, second) => second.count - first.count);
  console.log(data);
});
