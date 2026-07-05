const PLACEHOLDER = "—";

export const updateSelection = (selectElement, priceId, scoreId) => {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = selectedOption.getAttribute("data-price");
    const score = selectedOption.value;

    const priceEl = document.getElementById(priceId);
    const scoreEl = document.getElementById(scoreId);

    if (price === null || score === "0") {
        priceEl.textContent = PLACEHOLDER;
        scoreEl.textContent = PLACEHOLDER;
        return;
    }

    priceEl.textContent = price;
    scoreEl.textContent = score;
};
