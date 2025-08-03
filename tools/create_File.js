import fs from "fs";
import path from "path";
export const create_File = ({ fileName, folderName = "default", content }) => {
    const dirPath = path.join("./generated-content", folderName);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, fileName), content);
    return `✅ Created ${fileName} in ${folderName}`;
};
