const { app, BrowserWindow } = require("electron");

const { startWatcher } = require("./backend/watcher");
const { createTray } = require("./backend/tray");
const { setDefaultConfigs } = require("./backend/configs");

app.on("ready", async () => {
  createTray();
  await startWatcher();
  await setDefaultConfigs();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
