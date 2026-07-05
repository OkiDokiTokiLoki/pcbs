const DRAG_THRESHOLD = 5;

export const initDrag = (container) => {
    let isDragging = false;
    let hasMoved = false;
    let startX;
    let scrollLeft;
    let offsetLeft;

    const startDragging = (e) => {
        isDragging = true;
        hasMoved = false;
        offsetLeft = container.offsetLeft;
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        startX = pageX - offsetLeft;
        scrollLeft = container.scrollLeft;
    };

    const stopDragging = () => {
        isDragging = false;
        hasMoved = false;
    };

    const doDragging = (e) => {
        if (!isDragging) return;

        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        const x = pageX - offsetLeft;
        const walk = x - startX;

        if (!hasMoved) {
            if (Math.abs(walk) < DRAG_THRESHOLD) return;
            hasMoved = true;
        }

        e.preventDefault();
        container.scrollLeft = scrollLeft - walk * 2;
    };

    container.addEventListener("mousedown", startDragging);
    container.addEventListener("mouseleave", stopDragging);
    container.addEventListener("mouseup", stopDragging);
    container.addEventListener("mousemove", doDragging);

    container.addEventListener("touchstart", startDragging, { passive: true });
    container.addEventListener("touchend", stopDragging, { passive: true });
    container.addEventListener("touchmove", doDragging, { passive: false });
};

export const initAllDrag = (selector = ".button-container") => {
    document.querySelectorAll(selector).forEach(initDrag);
};
