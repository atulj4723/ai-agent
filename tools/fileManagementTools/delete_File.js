import fs from "fs";
import trash from "trash";
export async function delete_File({ filePath, permanantly=false }) {
    if (!permanantly) {
        if (!fs.existsSync(filePath)) {
            return `❌ File not found at ${filePath}`;
        }
        try {
            await trash(filePath);
            return `♻️ Moved file to the Recycle Bin: ${filePath}`;
        } catch (error) {
            console.error("Failed to move file to trash:", error);
            return `❌ Failed to move file to the Recycle Bin. Error: ${error.message}`;
        }
    }
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return `🗑️ Deleted ${filePath}`;
    }
    return `❌ File not found at ${filePath}`;
}
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
            permanantly: {
                type: "boolean",
                description:
                    "If true, the file will be permanently deleted without moving to the Recycle Bin.Ask for permanantly delete or move to Recycle Bin",
                
            },
        },
        required: ["filePath", "permanantly"],
    },
};
