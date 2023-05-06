const db = require("./db");

const historyLimitList = [5, 15, 25, 50, 100, 200, 500, 1000];

async function setDefaultConfigs() {
  const configs = await db.selectFirst("settings");

  if (!configs) {
    const defaultDatas = {
      historyLimit: 5,
      showClipboardShotcut: "CommandOrControl+Shift+V",
      systemLaunch: true,
      systemTray: true,
    };

    await db.add("settings", defaultDatas);
  }
}

module.exports = {
  setDefaultConfigs,
  historyLimitList,
};
