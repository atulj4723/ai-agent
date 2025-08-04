import fs from 'fs';
import path from 'path';

const outputFile = 'tree.txt';
const excludedFolders = ['.git', 'node_modules']; // folders to skip

const writeStream = fs.createWriteStream(outputFile);

function printTree(dir, prefix = "") {
    const items = fs.readdirSync(dir);
    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const connector = isLast ? "└── " : "├── ";
        const itemPath = path.join(dir, item);

        // Skip excluded folders
        if (excludedFolders.includes(item)) return;

        writeStream.write(prefix + connector + item + "\n");

        // Recurse if it's a folder
        if (fs.lstatSync(itemPath).isDirectory()) {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            printTree(itemPath, newPrefix);
        }
    });
}

printTree(".");
writeStream.end(() => console.log(`✅ Folder structure saved to ${outputFile}`));
