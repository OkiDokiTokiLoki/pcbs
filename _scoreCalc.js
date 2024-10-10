const resultDiv = document.getElementById("result");

// Function to calculate the final 3DMark score
export function calculateResult() {
  const value1 = Number(gpuSelect.value);
  const value2 = Number(cpuSelect.value);
  if (value1 && value2) {
    const result = 1 / (0.85 / value1 + 0.15 / value2);
    resultDiv.textContent = `${Math.floor(result)}`;
  } else {
    resultDiv.textContent = "";
  }
}
