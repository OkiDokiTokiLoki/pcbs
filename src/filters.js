export const initFilters = ({ gpuSelect, cpuSelect, gpuManufacturerButtons, socketButtons, gpuNoResultsEl, cpuNoResultsEl, onChange }) => {
    const selectedManufacturers = new Set();
    let activeSocketValue = "";
    let requiredGpu = 0;
    let requiredCpu = 0;

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
            const mfgOk = manufacturers.length === 0 || manufacturers.includes(option.dataset.manufacturer);
            const scoreOk = !requiredGpu || Number(option.value) >= requiredGpu;
            const visible = mfgOk && scoreOk;
            option.style.display = visible ? "" : "none";
            if (visible) gpuVisible++;
        });

        let cpuVisible = 0;
        Array.from(cpuSelect.options).forEach((option) => {
            if (option.value === "0") return;
            const socketOk = !activeSocketValue || option.dataset.socket === activeSocketValue;
            const scoreOk = !requiredCpu || Number(option.value) >= requiredCpu;
            const visible = socketOk && scoreOk;
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

    const setRequiredScores = ({ gpu, cpu }) => {
        requiredGpu = Number.isFinite(gpu) && gpu > 0 ? gpu : 0;
        requiredCpu = Number.isFinite(cpu) && cpu > 0 ? cpu : 0;
    };

    const reset = () => {
        selectedManufacturers.clear();
        activeSocketValue = "";
        requiredGpu = 0;
        requiredCpu = 0;
        syncManufacturerButtons();
        syncSocketButtons();
        apply();
    };

    return {
        getSelectedManufacturers: () => Array.from(selectedManufacturers),
        getActiveSocket: () => activeSocketValue,
        setRequiredScores,
        apply,
        reset,
    };
};
