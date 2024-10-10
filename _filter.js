const gpuSelect = document.getElementById("gpuSelect");
const cpuSelect = document.getElementById("cpuSelect");
const socketFilter = document.getElementById("socketFilter");

// Function to filter options based on manufacturer and socket
const filterOptions = (manufacturers, socketValue) => {
  Array.from(gpuSelect.options).forEach((option) => {
    option.style.display = manufacturers.length === 0 || manufacturers.includes(option.dataset.manufacturer) ? "" : "none";
  });

  Array.from(cpuSelect.options).forEach((option) => {
    option.style.display = !socketValue || option.dataset.socket === socketValue ? "" : "none";
  });

  calculateResult();
};

// Event listener for GPU manufacturer filter buttons
const gpuButtons = document.querySelectorAll("#gpuManufacturerFilter .filter-button");
const selectedManufacturers = new Set();

gpuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const manufacturerValue = button.value;

    // Toggle selection
    if (manufacturerValue) {
      if (selectedManufacturers.has(manufacturerValue)) {
        selectedManufacturers.delete(manufacturerValue);
        button.classList.remove("active"); // Remove active state
      } else {
        selectedManufacturers.add(manufacturerValue);
        button.classList.add("active"); // Add active state
      }
    } else {
      // Clear selection if "All manufacturers" is clicked
      selectedManufacturers.clear();
      gpuButtons.forEach((btn) => btn.classList.remove("active")); // Remove active state
    }

    const socketValue = document.querySelector("#socketFilter .filter-button.active")?.value || "";
    filterOptions(Array.from(selectedManufacturers), socketValue);
  });
});

// Event listener for socket filter buttons

const socketButtons = document.querySelectorAll("#socketFilter .filter-button");

socketButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const socketValue = button.value;

    // Toggle active state for the socket buttons
    if (button.classList.contains("active")) {
      button.classList.remove("active");
    } else {
      socketButtons.forEach((btn) => btn.classList.remove("active")); // Clear other active states
      button.classList.add("active");
    }

    const manufacturers = Array.from(selectedManufacturers);
    filterOptions(manufacturers, socketValue);
  });
});
