/**
 * @recipe Time Scale (January Start)
 * @description Creates a D3 time scale that enforces the domain to start from January 1st of the earliest data point's year.
 * 
 * Required variables in scope:
 * - data (array of objects with a date property)
 * - innerWidth (scale range maximum)
 */

// 1. Calculate domain extremes
const firstDateRaw = d3.min(data, (d) => d.date);
// Enforce starting from January 1st of the current year
const firstDate = new Date(firstDateRaw.getFullYear(), 0, 1, 0, 0, 0);
const lastDate = d3.max(data, (d) => d.date);

// 2. Create the scale
const xScale = d3
    .scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

// 3. Usage tip:
// const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
// chart.append("g").call(bottomAxis);
