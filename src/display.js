import { formatPrice } from "./format.js";

const PLACEHOLDER = "—";

export const updateSelection = (selectElement, priceElement, scoreElement) => {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = selectedOption.getAttribute("data-price");
    const score = selectedOption.value;

    if (price === null || score === "0") {
        priceElement.textContent = PLACEHOLDER;
        scoreElement.textContent = PLACEHOLDER;
        return;
    }

    priceElement.textContent = formatPrice(price);
    scoreElement.textContent = Number(score).toLocaleString();
};
