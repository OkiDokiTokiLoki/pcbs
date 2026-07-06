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
            const valueA = priceSort ? Number(a.dataset.price) : Number(a.dataset.price);
            const valueB = priceSort ? Number(b.dataset.price) : Number(b.dataset.price);
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

const applySort = (state, button, priceSort, gpuSelect, cpuSelect, onSort) => {
    if (state.direction === null) {
        state.direction = "asc";
    } else if (state.direction === "asc") {
        state.direction = "desc";
    } else {
        state.direction = "asc";
    }

    const ascending = state.direction === "asc";
    sortOptions(gpuSelect, ascending, priceSort);
    sortOptions(cpuSelect, ascending, priceSort);
    button.setAttribute("data-direction", state.direction);
    onSort?.();
};

export const initSort = ({ gpuSelect, cpuSelect, scoreSortButton, priceSortButton, onSort }) => {
    const scoreState = { direction: null };
    const priceState = { direction: null };

    scoreSortButton.addEventListener("click", () => {
        applySort(scoreState, scoreSortButton, false, gpuSelect, cpuSelect, onSort);
    });

    priceSortButton.addEventListener("click", () => {
        applySort(priceState, priceSortButton, true, gpuSelect, cpuSelect, onSort);
    });

    const reset = () => {
        scoreState.direction = null;
        priceState.direction = null;
        scoreSortButton.removeAttribute("data-direction");
        priceSortButton.removeAttribute("data-direction");
    };

    return { reset };
};
