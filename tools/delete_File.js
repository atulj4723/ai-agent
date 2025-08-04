import fs from "fs";
export const delete_File = ({ filePath }) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return `🗑️ Deleted ${filePath}`;
    }
    return `❌ File not found at ${filePath}`;
};
export const deleteDescription = {
    name: "delete_File",
    description: "Delete a specified file from the system.",
    parameters: {
        type: "object",
        properties: {
            filePath: {
                type: "string",
                description: "The full path to the file that will be deleted.",
            },
        },
        required: ["filePath"],
    },
};
