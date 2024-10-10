const buttonContainers = document.querySelectorAll(".button-container");

// Enables swiping/dragging with touch on mobile devices
buttonContainers.forEach((buttonContainer) => {
  let isDragging = false;
  let startX;
  let scrollLeft;

  const startDragging = (e) => {
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX - buttonContainer.offsetLeft; // Get the current position
    scrollLeft = buttonContainer.scrollLeft; // Store the current scroll position
  };

  const stopDragging = () => {
    isDragging = false; // Stop dragging
  };

  const doDragging = (e) => {
    if (!isDragging) return; // Only execute if dragging
    e.preventDefault(); // Prevent default behavior (e.g., text selection)
    const x = e.pageX || e.touches[0].pageX - buttonContainer.offsetLeft; // Get new position
    const walk = (x - startX) * 2; // Calculate distance moved
    buttonContainer.scrollLeft = scrollLeft - walk; // Scroll the container
  };

  // Mouse events
  buttonContainer.addEventListener("mousedown", startDragging);
  buttonContainer.addEventListener("mouseleave", stopDragging);
  buttonContainer.addEventListener("mouseup", stopDragging);
  buttonContainer.addEventListener("mousemove", doDragging);

  // Touch events
  buttonContainer.addEventListener("touchstart", startDragging);
  buttonContainer.addEventListener("touchend", stopDragging);
  buttonContainer.addEventListener("touchmove", doDragging);
});
