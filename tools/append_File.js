import fs from "fs";
import path from "path";
export const append_File = ({ fileName, folderName = "default", content }) => {
    const filePath = path.join("./generated-content", folderName, fileName);
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, content);
        return `➕ Appended to ${fileName} in ${folderName}`;
    }
    return `❌ ${fileName} not found in ${folderName}`;
};
