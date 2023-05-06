const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const historyLimitElement = document.querySelector("#historyLimit");
  const saveButton = document.querySelector("#saveButton");

  ipcRenderer.on("loadDatas", (event, loadDatas) => {
    console.log("loadDatas ", loadDatas);
    const { settings, historyLimitList } = loadDatas;

    historyLimitList.forEach((historyLimit) => {
      const option = document.createElement("option");
      option.value = historyLimit;
      option.text = historyLimit;
      if (historyLimit === settings.historyLimit) {
        option.selected = true;
      }

      historyLimitElement.appendChild(option);
    });
  });

  saveButton.addEventListener("click", () => {
    const datas = {};
    document.querySelectorAll(".settingInput").forEach((input) => {
      console.log("input ", input);

      const name = input.name;
      const value = input.type === "checkbox" ? input.checked : input.value;

      datas[name] = value;
    });

    ipcRenderer.send("saveDatas", datas);
  });
});
