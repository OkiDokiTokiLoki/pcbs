const gpuSelect = () => document.getElementById("gpuSelect");
const cpuSelect = () => document.getElementById("cpuSelect");
const gpuNoResults = () => document.getElementById("gpuNoResults");
const cpuNoResults = () => document.getElementById("cpuNoResults");

export const initFilters = ({ onChange }) => {
    const selectedManufacturers = new Set();
    let activeSocketValue = "";

    const gpuButtons = document.querySelectorAll("#gpuManufacturerFilter .filter-button");
    const allManufacturersButton = gpuButtons[0];

    const socketButtons = document.querySelectorAll("#socketFilter .filter-button");
    const allSocketsButton = socketButtons[0];

    const syncManufacturerButtons = () => {
        gpuButtons.forEach((btn) => {
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
        Array.from(gpuSelect().options).forEach((option) => {
            if (option.value === "0") return;
            const visible = manufacturers.length === 0 || manufacturers.includes(option.dataset.manufacturer);
            option.style.display = visible ? "" : "none";
            if (visible) gpuVisible++;
        });

        let cpuVisible = 0;
        Array.from(cpuSelect().options).forEach((option) => {
            if (option.value === "0") return;
            const visible = !activeSocketValue || option.dataset.socket === activeSocketValue;
            option.style.display = visible ? "" : "none";
            if (visible) cpuVisible++;
        });

        gpuNoResults().hidden = gpuVisible > 0;
        cpuNoResults().hidden = cpuVisible > 0;

        onChange?.({ gpuVisible, cpuVisible });
    };

    gpuButtons.forEach((button) => {
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

    return {
        getSelectedManufacturers: () => Array.from(selectedManufacturers),
        getActiveSocket: () => activeSocketValue,
        apply,
    };
};
