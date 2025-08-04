import fs from "fs";
import path from "path";
export const read_File = ({ filePath }) => {
    return fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf-8")
        : `❌ File not found at ${filePath}`;
};
export const readDescription = {
    name: "read_File",
    description: "Read the content of a specified file from the system.",
    parameters: {
        type: "object",
        properties: {
            filePath: {
                type: "string",
                description: "The full path to the file that will be read.",
            },
          
        },
        required: ["filePath"],
    },
};
