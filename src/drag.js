export const initDrag = (container) => {
    let isDragging = false;
    let startX;
    let scrollLeft;
    let offsetLeft;

    const startDragging = (e) => {
        isDragging = true;
        offsetLeft = container.offsetLeft;
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        startX = pageX - offsetLeft;
        scrollLeft = container.scrollLeft;
    };

    const stopDragging = () => {
        isDragging = false;
    };

    const doDragging = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        const x = pageX - offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
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
