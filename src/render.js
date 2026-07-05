import { gpus, cpus } from "./parts.js";
import { formatPrice } from "./format.js";

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
    const displayName = part.name.startsWith(part.manufacturer) ? part.name : `${part.manufacturer} ${part.name}`;
    option.textContent = `${displayName} | $${formatPrice(part.price)} | ${part.score.toLocaleString()}`;
    return option;
};

// Render one <select> from a parts list, preserving the current value
export const renderSelect = (selectEl, parts, kind) => {
    const previousValue = selectEl.value;

    selectEl.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "0";
    placeholder.textContent = "select...";
    selectEl.add(placeholder);

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

    if (previousValue && previousValue !== "0") {
        const match = Array.from(selectEl.options).find((o) => o.value === previousValue);
        if (match) match.selected = true;
    }
};

export const init = (gpuSelect, cpuSelect) => {
    renderSelect(gpuSelect, gpus, "gpu");
    renderSelect(cpuSelect, cpus, "cpu");
};
