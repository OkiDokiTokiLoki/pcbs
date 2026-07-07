import "./style.css";
import { gpus, cpus } from "./parts.js";
import { init as initSelects, renderSelect } from "./render.js";
import { initFilters } from "./filters.js";
import { initSort } from "./sort.js";
import { initAllDrag } from "./drag.js";
import { updateSelection, PLACEHOLDER } from "./display.js";
import { calculateScore, formatResult } from "./calculator.js";
import { initTarget, requiredScoreFor } from "./target.js";

// ========================================================================
// DOM references — queried once at startup
// ========================================================================
const gpuSelect = document.getElementById("gpuSelect");
const cpuSelect = document.getElementById("cpuSelect");
const gpuPriceEl = document.getElementById("gpuPrice");
const cpuPriceEl = document.getElementById("cpuPrice");
const gpuScoreEl = document.getElementById("gpuScore");
const cpuScoreEl = document.getElementById("cpuScore");
const gpuNoResultsEl = document.getElementById("gpuNoResults");
const cpuNoResultsEl = document.getElementById("cpuNoResults");
const gpuManufacturerButtons = document.querySelectorAll("#gpuManufacturerFilter .filter-button");
const socketButtons = document.querySelectorAll("#socketFilter .filter-button");
const scoreSortButton = document.getElementById("toggleSortScoreButton");
const priceSortButton = document.getElementById("toggleSortPriceButton");
const resultDiv = document.getElementById("result");
const resultWrapper = document.getElementById("resultWrapper");
const targetInput = document.getElementById("targetInput");
const resetButton = document.getElementById("resetFiltersButton");

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
    } else {
        resultDiv.textContent = PLACEHOLDER;
    }
};

// ========================================================================
// When filter selection becomes hidden, reset it to placeholder
// ========================================================================
const resetIfHidden = (selectElement, priceElement, scoreElement) => {
    if (selectElement.value !== "0" && selectElement.options[selectElement.selectedIndex].style.display === "none") {
        selectElement.value = "0";
        updateSelection(selectElement, priceElement, scoreElement);
    }
};

// ========================================================================
// Recompute the target-driven minimum scores and re-apply filters
// ========================================================================
const applyTarget = () => {
    const T = target.getTarget();
    const gpuVal = Number(gpuSelect.value);
    const cpuVal = Number(cpuSelect.value);
    filters.setRequiredScores({
        gpu: requiredScoreFor(T, cpuVal, "gpu"),
        cpu: requiredScoreFor(T, gpuVal, "cpu"),
    });
    filters.apply();
};

// ========================================================================
// Wire up modules
// ========================================================================

const sort = initSort({
    gpuSelect,
    cpuSelect,
    scoreSortButton,
    priceSortButton,
    onSort: calculateResult,
});

const filters = initFilters({
    gpuSelect,
    cpuSelect,
    gpuManufacturerButtons,
    socketButtons,
    gpuNoResultsEl,
    cpuNoResultsEl,
    onChange: () => {
        resetIfHidden(gpuSelect, gpuPriceEl, gpuScoreEl);
        resetIfHidden(cpuSelect, cpuPriceEl, cpuScoreEl);
        calculateResult();
    },
});

const target = initTarget({
    input: targetInput,
    onChange: applyTarget,
});

resetButton.addEventListener("click", () => {
    sort.reset();
    filters.reset();
    target.reset();
    renderSelect(gpuSelect, gpus, "gpu");
    renderSelect(cpuSelect, cpus, "cpu");
    updateSelection(gpuSelect, gpuPriceEl, gpuScoreEl);
    updateSelection(cpuSelect, cpuPriceEl, cpuScoreEl);
    calculateResult();
});

initAllDrag();

// ========================================================================
// Select change handlers
// ========================================================================
gpuSelect.addEventListener("change", () => {
    updateSelection(gpuSelect, gpuPriceEl, gpuScoreEl);
    applyTarget();
    calculateResult();
});

cpuSelect.addEventListener("change", () => {
    updateSelection(cpuSelect, cpuPriceEl, cpuScoreEl);
    applyTarget();
    calculateResult();
});

// ========================================================================
// Initial state
// ========================================================================
updateSelection(gpuSelect, gpuPriceEl, gpuScoreEl);
updateSelection(cpuSelect, cpuPriceEl, cpuScoreEl);
calculateResult();
