import fs from "fs";
import path from "path";
export const create_File = ({ filePath, content }) => {
    const dirPath = path.dirname(filePath);
    const fileName = path.basename(filePath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, fileName), content);
    return `✅ Created ${fileName} in ${dirPath}`;
};
export const createDescription = {
    name: "create_File",
    description:
        "Create a new file with specified content at a given path. If the directory does not exist, it will be created.",
    parameters: {
        type: "object",
        properties: {
            filePath: {
                type: "string",
                description:
                    "The full path where the file will be created, including the folder.",
            },
            content: {
                type: "string",
                description: "The content to write into the new file.",
            },
        },
        required: ["filePath", "content"],
    },
};
