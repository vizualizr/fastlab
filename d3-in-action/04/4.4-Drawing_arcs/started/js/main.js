import "../css/base.css"; 
import "../css/visualization.css";

import { tik, showElapsedTime } from "../js/utils.js";
import { drawLineChart } from "./plotter-line-chart.js";
import { drawArcChart } from "./plotter-arc-chart.js";


Promise.all([
  d3.csv("data/weekly_temperature.csv", (d) => {
    return {
      date: new Date(d.date),
      max_temp_F: +d.max_temp_F,
      avg_temp_F: +d.avg_temp_F,
      min_temp_F: +d.min_temp_F
    };
  }),
  d3.csv("data/daily_precipitations.csv", (d) => {
    return {
      date: new Date(d.date),
      total_precip_in: +d.total_precip_in
    };
  }),
  d3.json("/d3-in-action/asset/ko-KR.json"),
])
  .then(([tempData, prcpData, koKR]) => {
    if (tempData && prcpData && koKR) {

      // 강우 데이터를 모두 불러오면 아래처럼 데이터를 출력한다.
      console.log("> temp data loaded ", tempData);
      console.log("> precipitations data loaded ", prcpData);
      console.log("> locale data ", koKR);

      // ---------- loading completed
      showElapsedTime("loading");

      drawLineChart(tempData);
      drawArcChart(prcpData);
    
    } else {

      console.log("Resource found but the error with the response.");
      console.error("Loading failed");

    }
  })
  .catch((error) => {
    console.log("Loading failed [via catch].");
    console.error(error);
  });
