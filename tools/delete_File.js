import fs from "fs";
import path from "path";
export const delete_File = ({ fileName, folderName = "default" }) => {
    const filePath = path.join("./generated-content", folderName, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return `🗑️ Deleted ${filePath}`;
    }
    return `❌ ${fileName} not found in ${folderName}`;
};
