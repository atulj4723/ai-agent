import fs from "fs";
import path from "path";
export const list_Files = ({ folderName = "default" }) => {
    const folderPath = path.join("./generated-content", folderName);
    return fs.existsSync(folderPath)
        ? fs.readdirSync(folderPath).join(", ")
        : `❌ Folder '${folderName}' not found`;
};
