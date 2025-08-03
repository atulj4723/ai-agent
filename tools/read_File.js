import fs from "fs";
import path from "path";
export const read_File = ({ fileName, folderName = "default" }) => {
    const filePath = path.join("./generated-content", folderName, fileName);
    return fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf-8")
        : `❌ ${fileName} not found in ${folderName}`;
};
