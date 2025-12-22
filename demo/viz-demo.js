import * as d3 from "d3";
import { setupCanvas } from "../.gemini/templates/d3/snippets/setup-canvas.js";
import { drawBasicBar } from "../.gemini/templates/plot/presets/BasicBar.js";

// 1. D3 Snippet Demo (Complex/Custom)
const initD3 = () => {
    // Use the snippet to setup the "Stage"
    const { bounds, innerHeight } = setupCanvas("#d3-container", { top: 20 }, 600, 300);

    // Custom logic that the snippet doesn't cover (The "Art" part)
    bounds.append("circle")
        .attr("cx", 300)
        .attr("cy", innerHeight / 2)
        .attr("r", 50)
        .attr("fill", "tomato")
        .attr("opacity", 0.7);

    bounds.append("text")
        .attr("x", 300)
        .attr("y", innerHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dy", 5)
        .attr("fill", "white")
        .text("D3 Custom Snippet");
};

// 2. Plot Preset Demo (Simple/Standard)
const initPlot = () => {
    const data = [
        { label: "A", value: 10 },
        { label: "B", value: 40 },
        { label: "C", value: 30 },
        { label: "D", value: 20 }
    ];

    drawBasicBar({
        data: data,
        x: "label",
        y: "value",
        container: "#plot-container",
        options: {
            marginBottom: 40,
            y: { label: "Value count" },
            color: { legend: true }
        }
    });
};

initD3();
initPlot();
