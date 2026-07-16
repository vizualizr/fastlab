// Initialize the scales here
const xScale = d3.scaleBand();
const colorScale = d3.scaleOrdinal();
 
const defineScales = (data) => {
  
  // Scale for the horizontal axis
  // yScale은 그래프마다 달라지지만
  // xScale은 모두 동일하다. 
  xScale
    .domain(data.map(d => d.year))
    .range([0, innerWidth])
    .paddingInner(0.1)
  
  // Color scale
  colorScale
    .domain(formatsInfo.map(f => f.id))
    .range(formatsInfo.map(f => f.color));
  
};