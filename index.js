const fs = require('node:fs/promises');
const path = require('node:path');

const file = "file";
const folder = "folder";

const f = async () => {
    try {
        const basePath = path.join(__dirname, "test");

        await fs.mkdir(basePath);

        const arr1 = [];

        for (let i = 1; i <= 5; i++) {
            const createFolder = await fs.mkdir(path.join(basePath, `${folder}${i}`));
            const createFile = await fs.writeFile(path.join(basePath, `${file}${i}.txt`), "Hello World!!!");
            arr1.push(createFolder, createFile)
        }

        await Promise.all([...arr1])

        const arr2 = await fs.readdir(basePath);

        await Promise.all(arr2.map(async (item) => {
            const stat = await fs.stat(path.join(basePath, item));

            if (stat.isFile()) {
                console.log(`File: ${item}`);
            }

            if (stat.isDirectory()) {
                console.log(`Folder: ${item}`);
            }
        }))

    } catch (error) {
        console.log(error.message);
    }
}

f()


