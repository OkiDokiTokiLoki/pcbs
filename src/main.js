import "./style.css";
import { init as initSelects } from "./render.js";

const gpuSelect = document.getElementById("gpuSelect");
const cpuSelect = document.getElementById("cpuSelect");
const resultDiv = document.getElementById("result");

initSelects(gpuSelect, cpuSelect);

// DISPLAY ===================================================================================
// Function to update selection and display price/score
function updateSelection(selectId, priceId, scoreId) {
    const selectElement = document.getElementById(selectId);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = selectedOption.getAttribute("data-price");
    const score = selectedOption.value;

    // Early return if the placeholder option is selected
    if (price === null || score === "0") {
        document.getElementById(priceId).innerText = "—";
        document.getElementById(scoreId).innerText = "—";
        return;
    }

    document.getElementById(priceId).innerText = price;
    document.getElementById(scoreId).innerText = score;
}

// Event listeners for the selects
gpuSelect.addEventListener("change", function () {
    updateSelection("gpuSelect", "gpuPrice", "gpuScore");
    calculateResult();
});

cpuSelect.addEventListener("change", function () {
    updateSelection("cpuSelect", "cpuPrice", "cpuScore");
    calculateResult();
});

// Initialize the display so #gpuPrice/#cpuPrice start in a clean state
updateSelection("gpuSelect", "gpuPrice", "gpuScore");
updateSelection("cpuSelect", "cpuPrice", "cpuScore");

// SCORE/RESULT ===============================================================================
// Function to calculate the result
const calculateResult = () => {
    const value1 = Number(gpuSelect.value);
    const value2 = Number(cpuSelect.value);
    const resultWrapper = document.getElementById("resultWrapper");
    if (value1 > 0 && value2 > 0) {
        const result = 1 / (0.85 / value1 + 0.15 / value2);
        resultDiv.textContent = Math.floor(result).toLocaleString();
        resultWrapper.hidden = false;
    } else {
        resultDiv.textContent = "";
        resultWrapper.hidden = true;
    }
};

// SORT =======================================================================================
// Function to sort options (keeps the placeholder pinned to the top and preserves selection)
const sortOptions = (selectElement, ascending = true, priceSort = false) => {
    // Remember which option the user currently has selected (by its value)
    const previousValue = selectElement.value;

    // Pull out the placeholder so it's not sorted with the rest
    const options = Array.from(selectElement.options);
    const placeholder = options.shift();

    // Sort the remaining options
    options.sort((a, b) => {
        const valueA = priceSort ? Number(a.dataset.price) : Number(a.value);
        const valueB = priceSort ? Number(b.dataset.price) : Number(b.value);
        return ascending ? valueA - valueB : valueB - valueA;
    });

    // Re-add options in the new order
    selectElement.innerHTML = "";
    selectElement.add(placeholder);
    options.forEach((option) => selectElement.add(option));

    // Restore the selection by finding the matching option and marking it selected.
    // This is more reliable than just `select.value = previousValue` after re-attaching options.
    if (previousValue !== "0") {
        const toSelect = Array.from(selectElement.options).find((option) => option.value === previousValue);
        if (toSelect) toSelect.selected = true;
    } else {
        // Placeholder is always at index 0
        selectElement.selectedIndex = 0;
    }

    // Fire a 'change' event so the price/score display and the 3DMark result both refresh,
    // otherwise the UI looks "stuck" on the pre-sort values even though the selection is correct.
    selectElement.dispatchEvent(new Event("change"));
};

// Track sort orders
let scoreAscending = true; // Track score sort order
let priceAscending = true; // Track price sort order

// Function to toggle score sorting
document.getElementById("toggleSortScoreButton").addEventListener("click", () => {
    sortOptions(gpuSelect, scoreAscending, false);
    sortOptions(cpuSelect, scoreAscending, false);
    scoreAscending = !scoreAscending;
    document.getElementById("toggleSortScoreButton").setAttribute("data-direction", scoreAscending ? "asc" : "desc");
});

// Function to toggle price sorting
document.getElementById("toggleSortPriceButton").addEventListener("click", () => {
    sortOptions(gpuSelect, priceAscending, true);
    sortOptions(cpuSelect, priceAscending, true);
    priceAscending = !priceAscending;
    document.getElementById("toggleSortPriceButton").setAttribute("data-direction", priceAscending ? "asc" : "desc");
});

// FILTER ====================================================================================
// Function to filter options based on manufacturer and socket
const filterOptions = (manufacturers, socketValue) => {
    let gpuVisible = 0;
    Array.from(gpuSelect.options).forEach((option) => {
        if (option.value === "0") return; // skip placeholder
        const visible = manufacturers.length === 0 || manufacturers.includes(option.dataset.manufacturer);
        option.style.display = visible ? "" : "none";
        if (visible) gpuVisible++;
    });

    let cpuVisible = 0;
    Array.from(cpuSelect.options).forEach((option) => {
        if (option.value === "0") return; // skip placeholder
        const visible = !socketValue || option.dataset.socket === socketValue;
        option.style.display = visible ? "" : "none";
        if (visible) cpuVisible++;
    });

    // If a filter combination produces no GPU results, clear the manufacturer selection
    if (gpuVisible === 0 && manufacturers.length > 0) {
        selectedManufacturers.clear();
        syncManufacturerButtons();
        // Re-run GPU visibility now that manufacturers is empty
        gpuVisible = 0;
        Array.from(gpuSelect.options).forEach((option) => {
            if (option.value === "0") return;
            option.style.display = "";
            gpuVisible++;
        });
    }

    // If a filter combination produces no CPU results, clear the socket selection
    if (cpuVisible === 0 && socketValue) {
        activeSocketValue = "";
        syncSocketButtons();
        // Re-run CPU visibility now that socketValue is empty
        cpuVisible = 0;
        Array.from(cpuSelect.options).forEach((option) => {
            if (option.value === "0") return;
            option.style.display = "";
            cpuVisible++;
        });
    }

    // Reset the select value to placeholder if the current selection is now hidden
    if (gpuSelect.value !== "0" && gpuSelect.options[gpuSelect.selectedIndex].style.display === "none") {
        gpuSelect.value = "0";
        updateSelection("gpuSelect", "gpuPrice", "gpuScore");
    }
    if (cpuSelect.value !== "0" && cpuSelect.options[cpuSelect.selectedIndex].style.display === "none") {
        cpuSelect.value = "0";
        updateSelection("cpuSelect", "cpuPrice", "cpuScore");
    }

    // Toggle empty-state messages (suppressed when auto-reset kicked in)
    document.getElementById("gpuNoResults").hidden = true;
    document.getElementById("cpuNoResults").hidden = true;

    calculateResult();
};

// Event listener for GPU manufacturer filter buttons
const gpuButtons = document.querySelectorAll("#gpuManufacturerFilter .filter-button");
const selectedManufacturers = new Set();
const allManufacturersButton = gpuButtons[0]; // first button = "All manufacturers"

const syncManufacturerButtons = () => {
    gpuButtons.forEach((btn) => {
        if (btn === allManufacturersButton) {
            // "All manufacturers" is active when no specific manufacturer is selected
            btn.classList.toggle("active", selectedManufacturers.size === 0);
        } else {
            btn.classList.toggle("active", selectedManufacturers.has(btn.value));
        }
    });
};

gpuButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const manufacturerValue = button.value;

        if (manufacturerValue) {
            // Toggle a specific manufacturer
            if (selectedManufacturers.has(manufacturerValue)) {
                selectedManufacturers.delete(manufacturerValue);
            } else {
                selectedManufacturers.add(manufacturerValue);
            }
        } else {
            // "All manufacturers" clicked → clear all specific selections
            selectedManufacturers.clear();
        }

        syncManufacturerButtons();

        const socketValue = activeSocketValue;
        filterOptions(Array.from(selectedManufacturers), socketValue);
    });
});

// Initialize button states so "All manufacturers" is active on load
syncManufacturerButtons();

// Event listener for socket filter buttons
const socketButtons = document.querySelectorAll("#socketFilter .filter-button");
const allSocketsButton = socketButtons[0]; // first button = "All sockets"
let activeSocketValue = ""; // empty string = "All sockets"

const syncSocketButtons = () => {
    socketButtons.forEach((btn) => {
        const isAllButton = btn === allSocketsButton;
        const isActive = isAllButton ? activeSocketValue === "" : btn.value === activeSocketValue;
        btn.classList.toggle("active", isActive);
    });
};

socketButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const socketValue = button.value;

        if (socketValue) {
            // Clicking a specific socket toggles it on/off
            activeSocketValue = activeSocketValue === socketValue ? "" : socketValue;
        } else {
            // "All sockets" always resets to the no-filter state
            activeSocketValue = "";
        }

        syncSocketButtons();

        const manufacturers = Array.from(selectedManufacturers);
        filterOptions(manufacturers, activeSocketValue);
    });
});

// Initialize button states so "All sockets" is active on load
syncSocketButtons();

// DRAGGING ===================================================================================

const buttonContainers = document.querySelectorAll(".button-container");

buttonContainers.forEach((buttonContainer) => {
    let isDragging = false;
    let startX;
    let scrollLeft;

    const startDragging = (e) => {
        isDragging = true;
        startX = e.pageX || e.touches[0].pageX - buttonContainer.offsetLeft; // Get the current position
        scrollLeft = buttonContainer.scrollLeft; // Store the current scroll position
    };

    const stopDragging = () => {
        isDragging = false; // Stop dragging
    };

    const doDragging = (e) => {
        if (!isDragging) return; // Only execute if dragging
        e.preventDefault(); // Prevent default behavior (e.g., text selection)
        const x = e.pageX || e.touches[0].pageX - buttonContainer.offsetLeft; // Get new position
        const walk = (x - startX) * 2; // Calculate distance moved
        buttonContainer.scrollLeft = scrollLeft - walk; // Scroll the container
    };

    // Mouse events
    buttonContainer.addEventListener("mousedown", startDragging);
    buttonContainer.addEventListener("mouseleave", stopDragging);
    buttonContainer.addEventListener("mouseup", stopDragging);
    buttonContainer.addEventListener("mousemove", doDragging);

    // Touch events
    buttonContainer.addEventListener("touchstart", startDragging);
    buttonContainer.addEventListener("touchend", stopDragging);
    buttonContainer.addEventListener("touchmove", doDragging);
});
