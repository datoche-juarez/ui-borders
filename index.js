const originalBorders = new WeakMap(); // Stores original borders
const modifiedElements = new Set(); // Tracks modified elements
let bordersEnabled = false;
let observer = null;

function hasVisibleBorder(el) {
  const style = window.getComputedStyle(el);
  return (
    parseInt(style.borderWidth, 10) > 0 &&
    style.borderStyle !== "none" &&
    style.borderColor !== "transparent"
  );
}

function applyBorders({ respectExisting = false } = {}) {
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
}

function enableBorders({ respectExisting = false } = {}) {
  if (bordersEnabled) return;

  applyBorders({ respectExisting });

  // Set up a MutationObserver to monitor DOM changes
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Apply borders to newly added elements
          applyBorders({ respectExisting });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  bordersEnabled = true;
  console.log("Borders enabled with dynamic updates.");
}

function disableBorders() {
  if (!bordersEnabled) return;

  // Disconnect the MutationObserver
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Restore original borders for modified elements
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
