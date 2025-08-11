import fs from "fs";
import path from "path";
export const append_File = ({ filePath, content }) => {
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, content);
        return `➕ Appended to ${path.basename(filePath)} in ${path.dirname(
            filePath
        )}`;
    }
    return `❌ File not found at ${filePath}`;
};
export const appendDescription = {
    name: "append_File",
    description: "Append content to an existing file at a specified path.",
    parameters: {
        type: "object",
        properties: {
            filePath: {
                type: "string",
                description:
                    "The full path to the file where content will be appended.",
            },
            content: {
                type: "string",
                description: "The content to append to the file.",
            },
        },
        required: ["filePath", "content"],
    },
};
