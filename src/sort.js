const sortOptions = (selectElement, ascending, priceSort) => {
    const previousValue = selectElement.value;
    const options = Array.from(selectElement.options);
    const placeholder = options.shift();

    options.sort((a, b) => {
        const valueA = priceSort ? Number(a.dataset.price) : Number(a.value);
        const valueB = priceSort ? Number(b.dataset.price) : Number(b.value);
        return ascending ? valueA - valueB : valueB - valueA;
    });

    selectElement.innerHTML = "";
    selectElement.add(placeholder);
    options.forEach((option) => selectElement.add(option));

    if (previousValue !== "0") {
        const toSelect = Array.from(selectElement.options).find((o) => o.value === previousValue);
        if (toSelect) toSelect.selected = true;
    } else {
        selectElement.selectedIndex = 0;
    }

    selectElement.dispatchEvent(new Event("change"));
};

export const initSort = ({ gpuSelect, cpuSelect, onSort }) => {
    let scoreAscending = true;
    let priceAscending = true;

    document.getElementById("toggleSortScoreButton").addEventListener("click", () => {
        sortOptions(gpuSelect, scoreAscending, false);
        sortOptions(cpuSelect, scoreAscending, false);
        scoreAscending = !scoreAscending;
        document.getElementById("toggleSortScoreButton").setAttribute("data-direction", scoreAscending ? "asc" : "desc");
        onSort?.();
    });

    document.getElementById("toggleSortPriceButton").addEventListener("click", () => {
        sortOptions(gpuSelect, priceAscending, true);
        sortOptions(cpuSelect, priceAscending, true);
        priceAscending = !priceAscending;
        document.getElementById("toggleSortPriceButton").setAttribute("data-direction", priceAscending ? "asc" : "desc");
        onSort?.();
    });
};
