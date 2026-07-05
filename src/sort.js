const DRAG_THRESHOLD_PX = 5;

const sortOptionsInGroup = (group, ascending, priceSort) => {
    const options = Array.from(group.children);

    options.sort((a, b) => {
        const valueA = priceSort ? Number(a.dataset.price) : Number(a.value);
        const valueB = priceSort ? Number(b.dataset.price) : Number(b.value);
        return ascending ? valueA - valueB : valueB - valueA;
    });

    options.forEach((option) => group.appendChild(option));
};

const sortOptions = (selectElement, ascending, priceSort) => {
    const previousValue = selectElement.value;

    const placeholder = selectElement.querySelector('option[value="0"]');
    const optgroups = Array.from(selectElement.querySelectorAll("optgroup"));

    optgroups.forEach((group) => sortOptionsInGroup(group, ascending, priceSort));

    if (optgroups.length === 0) {
        const directOptions = Array.from(selectElement.children).filter((child) => child.tagName === "OPTION" && child.value !== "0");
        directOptions.sort((a, b) => {
            const valueA = priceSort ? Number(a.dataset.price) : Number(a.value);
            const valueB = priceSort ? Number(b.dataset.price) : Number(b.value);
            return ascending ? valueA - valueB : valueB - valueA;
        });
        directOptions.forEach((option) => selectElement.appendChild(option));
    }

    if (previousValue !== "0") {
        const toSelect = Array.from(selectElement.options).find((o) => o.value === previousValue);
        if (toSelect) toSelect.selected = true;
    } else {
        placeholder.selected = true;
    }

    selectElement.dispatchEvent(new Event("change"));
};

export const initSort = ({ gpuSelect, cpuSelect, scoreSortButton, priceSortButton, onSort }) => {
    let scoreAscending = true;
    let priceAscending = true;

    scoreSortButton.addEventListener("click", () => {
        sortOptions(gpuSelect, scoreAscending, false);
        sortOptions(cpuSelect, scoreAscending, false);
        scoreAscending = !scoreAscending;
        scoreSortButton.setAttribute("data-direction", scoreAscending ? "asc" : "desc");
        onSort?.();
    });

    priceSortButton.addEventListener("click", () => {
        sortOptions(gpuSelect, priceAscending, true);
        sortOptions(cpuSelect, priceAscending, true);
        priceAscending = !priceAscending;
        priceSortButton.setAttribute("data-direction", priceAscending ? "asc" : "desc");
        onSort?.();
    });
};
