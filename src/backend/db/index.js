const fs = require("fs").promises;
const path = require("path");

const jsonDir = "./jsons";

// Helper function to generate a unique ID
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Helper function to read a JSON file
async function readJsonFile(filePath) {
  const fileData = await fs.readFile(filePath);
  return JSON.parse(fileData);
}

// Helper function to write to a JSON file
async function writeJsonFile(filePath, data) {
  const jsonStr = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonStr);
}

// Helper function to create a JSON file if it doesn't exist
async function createJsonFileIfNotExists(filePath) {
  try {
    await fs.access(filePath);
  } catch (error) {
    await writeJsonFile(filePath, []);
  }
}

async function selectAll(tableName) {
  const filePath = path.join(__dirname, jsonDir, `${tableName}.json`);
  try {
    await fs.access(filePath);
    const jsonData = await readJsonFile(filePath);
    return jsonData;
  } catch (error) {
    return null;
  }
}

async function selectOne(tableName, id) {
  const jsonData = await selectAll(tableName);
  if (!jsonData) {
    return null;
  }
  return jsonData.find((item) => item.id === id) || null;
}

async function selectFirst(tableName) {
  const jsonData = await selectAll(tableName);
  if (!jsonData) {
    return null;
  }
  return jsonData[0] || null;
}

async function add(tableName, objectOrArrayData) {
  const filePath = path.join(__dirname, jsonDir, `${tableName}.json`);
  await createJsonFileIfNotExists(filePath);
  const jsonData = await readJsonFile(filePath);

  if (!Array.isArray(objectOrArrayData)) {
    objectOrArrayData = [objectOrArrayData];
  }

  const newData = objectOrArrayData.map((item) => ({
    ...item,
    id: generateUniqueId(),
  }));

  const mergedData = [...jsonData, ...newData];

  await writeJsonFile(filePath, mergedData);
  return newData;
}

async function deleteItem(tableName, id) {
  const filePath = path.join(__dirname, jsonDir, `${tableName}.json`);
  const jsonData = await readJsonFile(filePath);

  const newData = jsonData.filter((item) => item.id !== id);

  await writeJsonFile(filePath, newData);
}

async function update(tableName, objectOrArrayData) {
  const filePath = path.join(__dirname, jsonDir, `${tableName}.json`);
  const jsonData = await readJsonFile(filePath);

  if (!Array.isArray(objectOrArrayData)) {
    objectOrArrayData = [objectOrArrayData];
  }

  const updatedData = objectOrArrayData.map((newItem) => {
    const oldItem = jsonData.find((item) => item.id === newItem.id);
    return {
      ...oldItem,
      ...newItem,
    };
  });

  const newData = jsonData.map((item) => {
    const updatedItem = updatedData.find((newItem) => newItem.id === item.id);
    return updatedItem ? updatedItem : item;
  });

  await writeJsonFile(filePath, newData);
}

module.exports = {
  selectAll,
  selectOne,
  selectFirst,
  add,
  deleteItem,
  update,
};
