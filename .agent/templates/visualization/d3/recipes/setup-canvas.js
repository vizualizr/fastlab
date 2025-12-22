/**
 * @recipe Margin Convention Setup
 * @description Creates the standard D3 Margin Convention structure.
 * 
 * Required variables in scope:
 * - width, height (dimensions)
 * - containerSelector (e.g., "#chart")
 */

// 1. Define margins and inner dimensions
const margin = {
    top: 40,
    bottom: 25,
    right: 170,
    left: 40,
    get horizontalMargin() { return this.right + this.left; },
    get verticalMargin() { return this.top + this.bottom; }
};

const innerWidth = width - margin.horizontalMargin;
const innerHeight = height - margin.verticalMargin;

// 2. Clear and create SVG
const container = d3.select(containerSelector);
container.selectAll("*").remove();

const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "100%")
    .style("height", "auto");

// 3. Create inner group (bounds)
const bounds = svg
    .append("g")
    .style("transform", `translate(${margin.left}px, ${margin.top}px)`);
