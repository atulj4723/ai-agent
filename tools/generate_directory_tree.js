import fs from "fs";
import path from "path";
function buildTreeString(dir, exclude, prefix) {
    let tree = "";
    const items = fs.readdirSync(dir).filter((item) => !exclude.includes(item));
    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const connector = isLast ? "└── " : "├── ";
        const itemPath = path.join(dir, item);

        tree += prefix + connector + item + "\n";

        try {
            if (fs.statSync(itemPath).isDirectory()) {
                const newPrefix = prefix + (isLast ? "    " : "│   ");
                tree += buildTreeString(itemPath, exclude, newPrefix);
            }
        } catch (error) {
            // Silently ignore errors for inaccessible files/links
        }
    });
    return tree;
}

export function generate_directory_tree() {
    const rootDir = "."; // Always start from the project root
    const excludeFolders = [".git", "node_modules", ".env"];
console.log(`Generating directory tree from root: ${rootDir}`);
    let finalTree = `${path.basename(path.resolve(rootDir))}\n`;
    finalTree += buildTreeString(rootDir, excludeFolders, "");

    return finalTree;
}
export const generateDirectoryTreeDescription = {
    name: "generate_directory_tree",
    description:
        "Generate a directory tree structure of the project, excluding specific folders.",
    parameters: {
        type: "object",
        properties: {},
        required: [],
    },
};
