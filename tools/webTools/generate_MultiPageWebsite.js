import fs from "fs";
import path from "path";
export const generate_MultiPageWebsite = ({ pages, folderPath }) => {
    
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath,{ recursive: true });
    for (const { name, content } of pages) {
        fs.writeFileSync(path.join(folderPath, name), content);
    }
    return `✅ Generated ${pages.length} pages in ${folderPath}`;
};
export const generateDescription = {
    name: "generate_MultiPageWebsite",
    description: "Generate a multi-page website with specified pages and content.",
    parameters: {
        type: "object",
        properties: {
            pages: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "The name of the page file (e.g., 'index.html')."
                        },
                        content: {
                            type: "string",
                            description: "The HTML content for the page."
                        }
                    },
                    required: ["name", "content"]
                },
                description: "An array of pages to create in the website."
            },
            folderPath: {
                type: "string",
                description: "folderPath where the website will be generated.",
            }
        },
        required: ["pages"]
    }
};