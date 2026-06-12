const drawDonutCharts = (data) => {
  console.log("input data", data);

  // ---------------
  // SVG processing
  // ---------------
  // 최상단에 도넛 그래프가 들어갈 SVG 요소를 선언한다.

  const svg = d3
    .select("#donuts")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  console.log(
    svg instanceof d3.selection
      ? "svg is Selection obj"
      : "svg is not a Selection obj",
  );

  // SVG 요소 안에 두 개의 그룹이 중첩해서 들어간다.
  // 첫 번째인 아래 g 요소는 공통 여백 적용을 위해
  // 가장 바깥에 자리잡는 그룹이다.

  const donutContainers = svg
    .append("g")
    .attr("class", "donutContainers")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 아래 g 요소는 개별 도넛 차트가 들어갈 그룹이다.
  // 전체 데이터 가운데 3개 년도만 채택해 도넛 그래프를 그린다.
  // 세 개의 도넛 그래프는 개별 데이터만 다르고 그리는 방식은 동일하니
  // 아래처럼 배열로 연도를 선택해 동일한 작도를 반복하도록 한다.
  const years = [1975, 1995, 2013];

  // 포맷만 따로 추출한다.
  // 원본 데이터에 있는 제목행을 범주 자료롤 사용하기 위해서는
  // 범주만 남기고 나머지는 지워야 한다.
  // 제목행에는 "year" 문자열을 제외하면 범주 데이터이다.
  // 따라서 "year"와 다른 모든 문자열을 갖는 배열을 반환받기 위해 filter를 쓴 거다.

  const formats = data.columns.filter((format) => format !== "year");

  console.log(formats);

  // 순회(iteration)이므로 각 연도마다 아래 코드를 한 번씩 실행한다.
  // 따라서 이 함수가 years에 들어 있는 원소의 숫자만큼 순회하면서
  // 각 순회마다 해당 연도의 파이 그래프를 그린다.
  years.forEach((year, i) => {
    const donutContainer = donutContainers
      .append("g")
      .attr("class", `donutContainer${year}`)
      .attr("transform", `translate(${xScale(year)}, ${innerHeight / 2})`);

    // 우선 현재 연도의 데이터를 가져온다. find()는 첫번째 결과를 반환하고 실행을 종료한다.
    const yearData = data.find((d) => d.year === year);

    // 1975년의 yearData는 다음과 같다.
    //   {
    //     "year": 1975,
    //     "vinyl": 8061.75,
    //     "eight_track": 2770.41,
    //     "cassette": 469.496498141,
    //     "cd": 0,
    //     "download": 0,
    //     "streaming": 0,
    //     "other": 48.470286245
    // }

    // 새로운 배열 salesByFormatData에 판매량 통계 데이터를 추가한다.
    // 각 포맷마다 판매량을 추가한다.
    // 각 음반 배포 형태를 format이라는 키에,
    // 판매량은 sales라는 키에 할당한 객체를 다시 생성한다.

    // parameters: format, yearData
    // returns: undefined
    // result: updates salesByFormatData
    const salesByFormatData = [];
    formats.forEach((format) => {
      salesByFormatData.push({
        format: format,
        sales: yearData[format],
      });
    });

    // 1975년 salesByFormatData는 아래와 같다.
    //     [
    //     {
    //         "format": "vinyl",
    //         "sales": 8061.75
    //     },
    //     {
    //         "format": "eight_track",
    //         "sales": 2770.41
    //     },
    //     {
    //         "format": "cassette",
    //         "sales": 469.496498141
    //     },
    //     {
    //         "format": "cd",
    //         "sales": 0
    //     },
    //     {
    //         "format": "download",
    //         "sales": 0
    //     },
    //     {
    //         "format": "streaming",
    //         "sales": 0
    //     },
    //     {
    //         "format": "other",
    //         "sales": 48.470286245
    //     }
    // ]
    // console.log("salesByFormatData ", salesByFormatData);
    // 여기까지 마치면 각 연도별로
    // 개별 음반 배포 형식과 판매량을
    // 하나의 키값 쌍으로 연결한
    // 자료를 얻을 수 있다.

    // parameters: none
    // returns: A layout function which returns annotated data.
    // This function takes an Array (salesByFormatData in this code)
    // to compute the radians of each element.
    // This function approaches the necessary value via an accessor function, value()
    // as it is nested within the given array.
    // results: A functinon is ready to calculate layout data from converted data.
    const pieGenerator = d3.pie().value((d) => d.sales);
    // 통계 데이터를 바탕으로 제도 데이터를 생성하는 파이 생성기
    // pieGenerator를 생성한다.

    // parameters: salesByFormatData: Array
    // returns: annotatedData: Array
    // results: data to plot arcs in a single pie for the current year is ready
    const annotatedData = pieGenerator(salesByFormatData);

    // annotatedData라는 제도 데이터가 생성되었다.
    // 결과물은 7개의 객체 원소를 가진 배열이며 아래와 같다.
    // [
    //   {
    //     data: {
    //       format: "vinyl",
    //       sales: 8061.75,
    //     },
    //     endAngle: 4.462810866556783,
    //     index: 0,
    //     padAngle: 0,
    //     startAngle: 0,
    //     value: 8061.75,
    //   },
    // {...}, {...}, {...}, {...}, {...}, {...}, {...}
    // ];
    console.log("annotatedData ", annotatedData);

    // arcGenerator는 제도 데이터(annotatedData)를 넣으면
    // 제도명령어를 반환하는 함수다.

    // parameters: an iterable with radian values defining the beginning and the end of single arc
    // returns: function object that returns SVG commands fits to for d property in path element
    // results:
    const arcGenerator = d3
      .arc()
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle)
      .innerRadius(50)
      .outerRadius(100)
      .padAngle(0.01)
      .cornerRadius(2);

    // parameters: year: Number, annotatedData: Array donutContainer: Selection
    // returns: A Selection object with the DOM elements in the name of `<g class=`.arc-${year}`>`
    // the number of DOM elements in this Selection object follows the size of annotatedData array.
    // result: empty <g> elements joined with annotatedData is ready to take a <path> element
    const arcs = donutContainer
      .selectAll(`arc-${year}`)
      .data(annotatedData)
      .join("g")
      .attr("class", `arc-${year}`);

    // parameters: arcGenerator: Function colorScale: Function, __data__ in arcs
    // returns: A Selection object with an array of <path> elements
    // result: arcs now own single child <path> with its own angle and color
    const yearLabel = arcs
      .append("text")
      .text(year)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-family", "sans-serif")
      .style("font-size", "2rem")
      .style("font-weight", 700);

    arcs
      .append("path")
      .attr("d", arcGenerator)
      // catches d from __data__ in arcs
      .attr("fill", (d) => colorScale(d.data.format));

    // 각 원호에 숫자 레이블을 추가하고
    // arc.centroid()로 중심점을 계산해
    // 숫자 레이블을 해당 좌표로 이동한다.
    arcs
      .append("text")
      .text((d) => {
        // __data__에  `percentage`추가한다.
        // 각도 차이(d.endAngle - d.startAngle)가 전체 원 360도(2 * Math.PI)에서
        // 몇 퍼센트인지 값을 얻는다.
        d["percentage"] = (d.endAngle - d.startAngle) / (2 * Math.PI);
        return d3.format(".0%")(d.percentage);
      })
      // <text> 요소의 x, y 좌표를 지정한다.
      .attr("x", (d) => {
        // centroid는 무게 중심을 반환한다.
        d["centroid"] = arcGenerator
          .startAngle(d.startAngle)
          .endAngle(d.endAngle)
          .centroid();
        return d.centroid[0];
      })
      .attr("y", (d) => d.centroid[1])
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#f6fafc")
      .attr("fill-opacity", (d) => (d.percentage < 0.05 ? 0 : 1))
      .style("font-size", "1em")
      .style("font-weight", "500")
      .style("visibility", (d) => (d.percentage < 0.05 ? "hidden" : "visible"));
  });
};
