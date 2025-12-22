import * as Plot from "@observablehq/plot";

/**
 * @preset Basic Bar Chart
 * @description Renders a simple vertical or horizontal bar chart using Observable Plot.
 * 
 * @param {Object} config
 * @param {Array} config.data - Data array
 * @param {string} config.x - Field for X axis (categorical)
 * @param {string} config.y - Field for Y axis (quantitative)
 * @param {string|HTMLElement} config.container - Target element
 * @param {Object} [config.options] - Additional Plot options
 */
export const drawBasicBar = ({ data, x, y, container, options = {} }) => {
    const chart = Plot.plot({
        marks: [
            Plot.barY(data, { x: x, y: y, tip: true, fill: "steelblue", ...options })
        ],
        y: { grid: true },
        ...options
    });

    const target = document.querySelector(container);
    target.replaceChildren(chart);
    return chart;
};
