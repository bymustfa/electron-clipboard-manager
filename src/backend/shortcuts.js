const path = require("path");
const db = require("./db");
const icons = require("../assets/icons");

const shortcuts = () => {
  return {
    showClipboardShotcut: {
      label: "Show Clipboard",
      accelerator: "CommandOrControl+Shift+V",
      icon: icons.clipboard["16"],
      click: () => {
        console.log("Show Clipboard");
      },
    },
  };
};

module.exports = shortcuts;
