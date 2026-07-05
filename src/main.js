import "./style.css";
import { init as initSelects } from "./render.js";
import { initFilters } from "./filters.js";
import { initSort } from "./sort.js";
import { initAllDrag } from "./drag.js";
import { updateSelection } from "./display.js";
import { calculateScore, formatResult } from "./calculator.js";

// ========================================================================
// DOM references
// ========================================================================
const gpuSelect = document.getElementById("gpuSelect");
const cpuSelect = document.getElementById("cpuSelect");
const resultDiv = document.getElementById("result");
const resultWrapper = document.getElementById("resultWrapper");

// ========================================================================
// Render initial options into <select> elements
// ========================================================================
initSelects(gpuSelect, cpuSelect);

// ========================================================================
// Recalculate and display the 3DMark score
// ========================================================================
const calculateResult = () => {
    const value1 = Number(gpuSelect.value);
    const value2 = Number(cpuSelect.value);
    if (value1 > 0 && value2 > 0) {
        resultDiv.textContent = formatResult(calculateScore(value1, value2));
        resultWrapper.hidden = false;
    } else {
        resultDiv.textContent = "";
        resultWrapper.hidden = true;
    }
};

// ========================================================================
// When filter selection becomes hidden, reset it to placeholder
// ========================================================================
const resetIfHidden = (selectElement, priceId, scoreId) => {
    if (selectElement.value !== "0" && selectElement.options[selectElement.selectedIndex].style.display === "none") {
        selectElement.value = "0";
        updateSelection(selectElement, priceId, scoreId);
    }
};

// ========================================================================
// Wire up modules
// ========================================================================

// Sort: refreshes the result after a sort
initSort({
    gpuSelect,
    cpuSelect,
    onSort: calculateResult,
});

// Filters: triggers a recalculation when filters change
const filters = initFilters({
    onChange: () => {
        resetIfHidden(gpuSelect, "gpuPrice", "gpuScore");
        resetIfHidden(cpuSelect, "cpuPrice", "cpuScore");
        calculateResult();
    },
});

// Drag-to-scroll on all filter button containers
initAllDrag();

// ========================================================================
// Select change handlers
// ========================================================================
gpuSelect.addEventListener("change", () => {
    updateSelection(gpuSelect, "gpuPrice", "gpuScore");
    calculateResult();
});

cpuSelect.addEventListener("change", () => {
    updateSelection(cpuSelect, "cpuPrice", "cpuScore");
    calculateResult();
});

// ========================================================================
// Initial state
// ========================================================================
updateSelection(gpuSelect, "gpuPrice", "gpuScore");
updateSelection(cpuSelect, "cpuPrice", "cpuScore");
calculateResult();
