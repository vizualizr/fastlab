# Walkthrough: D3 Visualization Workflow

I have created a new workflow file to guide you through the process of building D3.js visualizations. This workflow is designed to reduce the mental overhead of "remembering every method" and focuses on a repeatable pipeline.

## Changes Made

### [NEW] [d3-visualization.md](file:///d:/yonggeun/porter/git/fastlab/.agent/workflows/d3-visualization.md)

The workflow defines a **6-step Data Flow Pipeline**:
1.  **Step 0: Data Source Verification**: Confirm your data is ready before drawing.
2.  **Step 1: Canvas Setup**: Define the workspace with margins.
3.  **Step 2: Scale Definition**: Establish the mathematical mapping.
4.  **Step 3: Data Binding**: Bridge data and SVG elements.
5.  **Step 4: Axis Implementation**: Add human-readable guides.
6.  **Step 5: Framework Adaptation**: Integrate into modern web stacks (Astro, Svelte).

## Validation Results

- The workflow correctly incorporates the **Step 0 (Verification)** and **Step 5 (Adaptation)** that you requested.
- It emphasizes the **"Copy-Paste-Refactor"** strategy to make D3 more approachable.
- It clarifies the role of `d` (data binding) to help you understand existing code better.

You can now use this workflow whenever you start a new D3 project by referring to the `.agent/workflows/d3-visualization.md` file.
