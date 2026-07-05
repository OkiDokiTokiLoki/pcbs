export const initFilters = ({ gpuSelect, cpuSelect, gpuManufacturerButtons, socketButtons, gpuNoResultsEl, cpuNoResultsEl, onChange }) => {
    const selectedManufacturers = new Set();
    let activeSocketValue = "";

    const allManufacturersButton = gpuManufacturerButtons[0];
    const allSocketsButton = socketButtons[0];

    const syncManufacturerButtons = () => {
        gpuManufacturerButtons.forEach((btn) => {
            if (btn === allManufacturersButton) {
                btn.classList.toggle("active", selectedManufacturers.size === 0);
            } else {
                btn.classList.toggle("active", selectedManufacturers.has(btn.value));
            }
        });
    };

    const syncSocketButtons = () => {
        socketButtons.forEach((btn) => {
            const isAllButton = btn === allSocketsButton;
            const isActive = isAllButton ? activeSocketValue === "" : btn.value === activeSocketValue;
            btn.classList.toggle("active", isActive);
        });
    };

    const apply = () => {
        const manufacturers = Array.from(selectedManufacturers);

        let gpuVisible = 0;
        Array.from(gpuSelect.options).forEach((option) => {
            if (option.value === "0") return;
            const visible = manufacturers.length === 0 || manufacturers.includes(option.dataset.manufacturer);
            option.style.display = visible ? "" : "none";
            if (visible) gpuVisible++;
        });

        let cpuVisible = 0;
        Array.from(cpuSelect.options).forEach((option) => {
            if (option.value === "0") return;
            const visible = !activeSocketValue || option.dataset.socket === activeSocketValue;
            option.style.display = visible ? "" : "none";
            if (visible) cpuVisible++;
        });

        gpuNoResultsEl.hidden = gpuVisible > 0;
        cpuNoResultsEl.hidden = cpuVisible > 0;

        onChange?.({ gpuVisible, cpuVisible });
    };

    gpuManufacturerButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const manufacturerValue = button.value;
            if (manufacturerValue) {
                if (selectedManufacturers.has(manufacturerValue)) {
                    selectedManufacturers.delete(manufacturerValue);
                } else {
                    selectedManufacturers.add(manufacturerValue);
                }
            } else {
                selectedManufacturers.clear();
            }
            syncManufacturerButtons();
            apply();
        });
    });

    socketButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const socketValue = button.value;
            if (socketValue) {
                activeSocketValue = activeSocketValue === socketValue ? "" : socketValue;
            } else {
                activeSocketValue = "";
            }
            syncSocketButtons();
            apply();
        });
    });

    syncManufacturerButtons();
    syncSocketButtons();

    const reset = () => {
        selectedManufacturers.clear();
        activeSocketValue = "";
        syncManufacturerButtons();
        syncSocketButtons();
        apply();
    };

    return {
        getSelectedManufacturers: () => Array.from(selectedManufacturers),
        getActiveSocket: () => activeSocketValue,
        apply,
        reset,
    };
};
