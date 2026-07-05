// Owns sort state. Preserves <optgroup> structure when sorting.

const sortOptionsInGroup = (group, ascending, priceSort) => {
    const options = Array.from(group.children);

    options.sort((a, b) => {
        const valueA = priceSort ? Number(a.dataset.price) : Number(a.value);
        const valueB = priceSort ? Number(b.dataset.price) : Number(b.value);
        return ascending ? valueA - valueB : valueB - valueA;
    });

    // Re-append sorted options (detaching + re-appending moves them in the DOM)
    options.forEach((option) => group.appendChild(option));
};

const sortOptions = (selectElement, ascending, priceSort) => {
    const previousValue = selectElement.value;

    // Walk the DOM tree instead of selectElement.options (which flattens optgroups)
    const placeholder = selectElement.querySelector('option[value="0"]');
    const optgroups = Array.from(selectElement.querySelectorAll("optgroup"));

    // Sort options inside each optgroup
    optgroups.forEach((group) => sortOptionsInGroup(group, ascending, priceSort));

    // If the select has no optgroups, sort the direct <option> children (CPU case)
    if (optgroups.length === 0) {
        const directOptions = Array.from(selectElement.children).filter((child) => child.tagName === "OPTION" && child.value !== "0");
        directOptions.sort((a, b) => {
            const valueA = priceSort ? Number(a.dataset.price) : Number(a.value);
            const valueB = priceSort ? Number(b.dataset.price) : Number(b.value);
            return ascending ? valueA - valueB : valueB - valueA;
        });
        directOptions.forEach((option) => selectElement.appendChild(option));
    }

    // Restore the selection
    if (previousValue !== "0") {
        const toSelect = Array.from(selectElement.options).find((o) => o.value === previousValue);
        if (toSelect) toSelect.selected = true;
    } else {
        // Placeholder is always the first <option> child of <select>
        placeholder.selected = true;
    }

    // Fire change so price/score/result display refresh
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
