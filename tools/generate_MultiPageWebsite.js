import fs from "fs";
import path from "path";
export const generate_MultiPageWebsite = ({ pages, folder = "default" }) => {
    const dir = `./generated-content/${folder}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir,{ recursive: true });
    for (const { name, content } of pages) {
        fs.writeFileSync(path.join(dir, name), content);
    }
    return `🌐 Website created in ${dir} with ${pages.length} pages.`;
};
