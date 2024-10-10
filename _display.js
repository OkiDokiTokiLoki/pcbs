import { calculateResult } from "./_scoreCalc.js";

const gpuSelect = document.getElementById("gpuSelect");
const cpuSelect = document.getElementById("cpuSelect");

// Function to update selection and display price/score
function updateSelection(selectId, priceId, scoreId) {
  const selectElement = document.getElementById(selectId);
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const price = selectedOption.getAttribute("data-price");
  const score = selectedOption.value;

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
