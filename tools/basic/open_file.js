import fs from "fs";
import open from "open"; // Import the new package
import path from "path";
export async function open_file({ file_path }) {
    // First, verify that the file actually exists.
    if (!fs.existsSync(file_path)) {
        return `❌ Error: Cannot open file. File not found at path: ${file_path}`;
    }

    try {
        // The 'await' is important. 'open' returns a promise.
        await open(file_path);
        return `✅ Successfully opened ${path.basename(file_path)}.`;
    } catch (error) {
        console.error("Failed to open file:", error);
        return `❌ Failed to open file. Error: ${error.message}`;
    }
}

export const openFileDescription = {
    name: "open_file",
    description:
        "Used to open the files in device application.Like images videos and audio.",
    parameters: {
        type: "object",
        properties: {
            file_path: {
                type: "string",
                description: "Specific file path to open the file.",
            },
        },
        required: ["file_path"],
    },
};
