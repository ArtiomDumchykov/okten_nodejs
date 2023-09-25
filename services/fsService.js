const fs = require("node:fs/promises");
const path = require("node:path");

const dbPath = path.join(process.cwd(), "db", "users.json")

const reader = async () => {
    const dataJson = await fs.readFile(dbPath, {encoding: "utf-8"})
    const data = await JSON.parse(dataJson);
    return data
}

const writer = async (users) => {
    await fs.writeFile(dbPath, JSON.stringify(users))
}

module.exports = {
    reader,
    writer,
}