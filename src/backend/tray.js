const { Tray, Menu, app, BrowserWindow } = require("electron");
const { openSettingsWindow } = require("./settings");
const icons = require("../assets/icons");
const shortcuts = require("./shortcuts");

let tray = null;

const createTray = () => {
  tray = new Tray(icons.logo["16"]);
  tray.setToolTip("Clipboard Manager");

  const { showClipboardShotcut } = shortcuts();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: showClipboardShotcut.label,
      icon: showClipboardShotcut.icon,
      accelerator: showClipboardShotcut.accelerator,
      click: showClipboardShotcut.click,
    },

    // separator
    {
      type: "separator",
    },

    {
      label: "Settings",
      icon: icons.sliders["16"],
      click: () => {
        openSettingsWindow();
      },
    },
    {
      label: "Quit",
      icon: icons.power["16"],
      click: () => {
        BrowserWindow.getAllWindows().forEach((win) => {
          win.close();
        });

        // Remove the tray icon
        tray.destroy();

        // Quit the app
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
};

module.exports = { createTray };
