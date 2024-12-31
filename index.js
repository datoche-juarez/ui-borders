let bordersEnabled = false;

function enableBorders() {
  if (bordersEnabled) return;
  document.querySelectorAll("*").forEach((el, index) => {
    el.style.border = `2px solid ${
      ["red", "blue", "green", "yellow"][index % 4]
    }`;
  });
  bordersEnabled = true;
  console.log("Borders enabled.");
}

function disableBorders() {
  if (!bordersEnabled) return;
  document.querySelectorAll("*").forEach((el) => {
    el.style.border = "none";
  });
  bordersEnabled = false;
  console.log("Borders disabled.");
}

module.exports = { enableBorders, disableBorders };
