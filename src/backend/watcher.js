const { clipboard } = require("electron");
const db = require("./db");

let watcher = null;
let lastCopied = null;

// check limit and delete old items
const limitControl = async () => {
  const settings = await db.selectFirst("settings");
  const historyLimit = settings.historyLimit;
  const copies = await db.selectAll("copies");

  if (copies.length > historyLimit) {
    const ids = copies
      .map((copy) => copy.id)
      .slice(0, copies.length - historyLimit)
      .map(async (id) => {
        await db.deleteItem("copies", id);
      });
  }
};

// every 500ms check clipboard and add new item
// and every 15s check limit and delete old items
const startWatcher = async () => {
  if (!watcher) {
    watcher = setInterval(async () => {
      const oldText = clipboard.readText();

      if (oldText !== lastCopied) {
        lastCopied = oldText;

        await db.add("copies", { text: oldText });
      }
    }, 500);

    setInterval(limitControl, 15000);
  }
};

const stopWatcher = () => {
  if (watcher) {
    clearInterval(watcher);
    watcher = null;
  }
};

module.exports = { startWatcher, stopWatcher };
