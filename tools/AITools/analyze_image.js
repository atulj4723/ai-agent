import fs from "fs";
import path from "path";
import { ai } from "../../config.js";
import { create_File } from "../fileManagementTools/create_File.js";

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
        case ".jfif":
            return "image/jpeg";
        case ".webp":
            return "image/webp";
        case ".gif":
            return "image/gif";
        default:
            return null;
    }
}

export async function analyze_image({ file_path, question }) {
    if (!fs.existsSync(file_path)) {
        return `❌ Error: File not found at the specified path: ${file_path}`;
    }
    const mimeType = getMimeType(file_path);
    if (!mimeType) {
        return `❌ Error: Unsupported image file type. Please use PNG, JPG, JFIF, WEBP, or GIF.`;
    }

    try {
        const imageBuffer = fs.readFileSync(file_path);
        const imageBase64 = imageBuffer.toString("base64");
        const promptParts = [
            { text: question },
            {
                inlineData: {
                    mimeType: mimeType,
                    data: imageBase64,
                },
            },
        ];

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: promptParts }],
        });
        create_File({
            filePath: "generated-content/last_analyzed_image.txt",
            content: `Last analyzed image: ${JSON.stringify(result)}`,
        });
        const responseText = result.candidates[0]?.content?.parts[0]?.text || "No response text available.";
        return `Analysis of ${path.basename(file_path)}: ${responseText}`;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return `❌ An error occurred during image analysis. Please check the file and API key.`;
    }
}
export const analyzeImageDescription = {
    name: "analyze_image",
    description: "Analyze an image and answer a question about it.",
    parameters: {
        type: "object",
        properties: {
            file_path: {
                type: "string",
                description: "Path to the image file to analyze.",
            },
            question: {
                type: "string",
                description: "Question about the image.",
            },
        },
        required: ["file_path", "question"],
    },
};
