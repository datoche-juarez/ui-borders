const originalBorders = new WeakMap(); // Stores original borders
const modifiedElements = new Set(); // Tracks modified elements
let bordersEnabled = false;

function hasVisibleBorder(el) {
  const style = window.getComputedStyle(el);
  return (
    parseInt(style.borderWidth, 10) > 0 &&
    style.borderStyle !== "none" &&
    style.borderColor !== "transparent"
  );
}

function enableBorders({ respectExisting = false } = {}) {
  if (bordersEnabled) return;

  document.querySelectorAll("*").forEach((el, index) => {
    if (respectExisting && hasVisibleBorder(el)) return; // Skip elements with visible borders
    if (!originalBorders.has(el)) {
      originalBorders.set(el, el.style.border); // Save original border
      modifiedElements.add(el); // Track this element
    }
    el.style.border = `2px solid ${
      ["red", "blue", "green", "yellow"][index % 4]
    }`; // Apply debug border
  });

  bordersEnabled = true;
  console.log("Borders enabled.");
}

function disableBorders() {
  if (!bordersEnabled) return;

  // Iterate over modified elements and restore their original borders
  modifiedElements.forEach((el) => {
    if (el.isConnected) {
      el.style.border = originalBorders.get(el) || ""; // Restore original border or clear
    }
  });

  modifiedElements.clear(); // Clear the set of modified elements
  bordersEnabled = false;
  console.log("Borders disabled.");
}

module.exports = {
  enableBorders,
  disableBorders,
  enableBordersRespectingExisting: () =>
    enableBorders({ respectExisting: true }),
  enableBordersIgnoringExisting: () =>
    enableBorders({ respectExisting: false }),
};
