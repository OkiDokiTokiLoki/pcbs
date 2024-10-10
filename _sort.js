const gpuSelect = document.getElementById("gpuSelect");
const cpuSelect = document.getElementById("cpuSelect");

// Function to sort options based on price and individual pc-part score
const sortOptions = (selectElement, ascending = true, priceSort = false) => {
  const options = Array.from(selectElement.options);
  options.sort((a, b) => {
    const valueA = priceSort ? Number(a.dataset.price) : Number(a.value);
    const valueB = priceSort ? Number(b.dataset.price) : Number(b.value);
    return ascending ? valueA - valueB : valueB - valueA;
  });
  selectElement.innerHTML = "";
  options.forEach((option) => selectElement.add(option));
};

// Track sort orders and button states
let scoreAscending = true; // Track score sort order
let priceAscending = true; // Track price sort order
let scoreButtonActive = false; // Track if score button is active
let priceButtonActive = false; // Track if price button is active

// Function to toggle score sorting
document.getElementById("toggleSortScoreButton").addEventListener("click", () => {
  sortOptions(gpuSelect, scoreAscending, false);
  sortOptions(cpuSelect, scoreAscending, false);
  scoreAscending = !scoreAscending; // Toggle the order

  // Toggle button background
  const scoreButton = document.getElementById("toggleSortScoreButton");
  scoreButtonActive = !scoreButtonActive;
  scoreButton.style.backgroundColor = scoreButtonActive ? "yellow" : "";
});

// Function to toggle price sorting
document.getElementById("toggleSortPriceButton").addEventListener("click", () => {
  sortOptions(gpuSelect, priceAscending, true);
  sortOptions(cpuSelect, priceAscending, true);
  priceAscending = !priceAscending; // Toggle the order

  // Toggle button background
  const priceButton = document.getElementById("toggleSortPriceButton");
  priceButtonActive = !priceButtonActive;
  priceButton.style.backgroundColor = priceButtonActive ? "red" : "";
});

// const gpuSelect = document.getElementById("gpuSelect");
// const cpuSelect = document.getElementById("cpuSelect");

// // Function to sort options based on price and individual pc-part score
// const sortOptions = (selectElement, ascending = true, priceSort = false) => {
//   const options = Array.from(selectElement.options);
//   options.sort((a, b) => {
//     const valueA = priceSort ? Number(a.dataset.price) : Number(a.value);
//     const valueB = priceSort ? Number(b.dataset.price) : Number(b.value);
//     return ascending ? valueA - valueB : valueB - valueA;
//   });
//   selectElement.innerHTML = "";
//   options.forEach((option) => selectElement.add(option));
// };

// // Track sort orders
// let scoreAscending = true; // Track score sort order
// let priceAscending = true; // Track price sort order

// // Function to toggle score sorting
// document.getElementById("toggleSortScoreButton").addEventListener("click", () => {
//   sortOptions(gpuSelect, scoreAscending, false);
//   sortOptions(cpuSelect, scoreAscending, false);
//   scoreAscending = !scoreAscending; // Toggle the order
// });

// // Function to toggle price sorting
// document.getElementById("toggleSortPriceButton").addEventListener("click", () => {
//   sortOptions(gpuSelect, priceAscending, true);
//   sortOptions(cpuSelect, priceAscending, true);
//   priceAscending = !priceAscending; // Toggle the order
// });
