import { gpus, cpus } from "./parts.js";

const formatPrice = (n) => "$" + n.toLocaleString("en-US");

// Build a single <option> element from a part
const buildOption = (part, kind) => {
    const option = document.createElement("option");
    option.value = part.score;
    option.dataset.price = part.price;
    if (kind === "gpu") {
        option.dataset.manufacturer = part.manufacturer;
        option.dataset.cooling = part.cooling;
    } else {
        option.dataset.socket = part.socket;
    }
    option.textContent = `[${part.score}] ${part.name} | ${formatPrice(part.price)}`;
    return option;
};

// Render one <select> from a parts list, preserving the current value
export const renderSelect = (selectEl, parts, kind) => {
    const previousValue = selectEl.value;

    // Wipe everything including the placeholder, then rebuild
    selectEl.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "0";
    placeholder.textContent = "select...";
    selectEl.add(placeholder);

    // Group aircooled vs watercooled for GPUs (matches the old optgroup layout)
    if (kind === "gpu") {
        for (const cooling of ["aircooled", "watercooled"]) {
            const group = document.createElement("optgroup");
            group.label = cooling === "aircooled" ? "Normal GPUs" : "Watercooled GPUs";
            for (const part of parts) {
                if (part.cooling === cooling) group.appendChild(buildOption(part, kind));
            }
            selectEl.add(group);
        }
    } else {
        for (const part of parts) selectEl.add(buildOption(part, kind));
    }

    // Restore the previous selection if it still exists
    if (previousValue && previousValue !== "0") {
        const match = Array.from(selectEl.options).find((o) => o.value === previousValue);
        if (match) match.selected = true;
    }
};

export const init = (gpuSelect, cpuSelect) => {
    renderSelect(gpuSelect, gpus, "gpu");
    renderSelect(cpuSelect, cpus, "cpu");
};
