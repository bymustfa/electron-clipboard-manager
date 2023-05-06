const { app, BrowserWindow, ipcMain, clipboard } = require("electron");
const path = require("path");
const db = require("./db");
const isDev = require("electron-is-dev");
const { historyLimitList } = require("./configs");

let settingsWindow = null;

const openSettingsWindow = async () => {
  const settings = await db.selectFirst("settings");

  if (!settingsWindow) {
    settingsWindow = new BrowserWindow({
      width: 400,
      height: 550,
      resizable: false,
      minimizable: false,
      maximizable: false,
      closable: true,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(
          __dirname,
          "..",
          "client",
          "settings",
          "settings_preload.js"
        ),
      },
    });

    settingsWindow.loadFile(
      path.join(__dirname, "..", "client", "settings", "settings.html")
    );

    settingsWindow.webContents.on("did-finish-load", () => {
      settingsWindow.webContents.send("loadDatas", {
        settings: settings,
        historyLimitList: historyLimitList,
      });
    });
  } else {
    settingsWindow.reload();
    settingsWindow.show();
  }

  isDev && settingsWindow.webContents.openDevTools();

  settingsWindow.on("close", (event) => {
    event.preventDefault();
    isDev && settingsWindow.webContents.closeDevTools();
    settingsWindow.hide();
  });

  app.on("before-quit", () => {
    settingsWindow.destroy();
    settingsWindow = null;
  });
};

ipcMain.on("saveDatas", async (event, datas) => {
  console.log("saveDatas ", datas);
});

module.exports = {
  openSettingsWindow,
};
