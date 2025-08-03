import { GoogleGenAI, Type } from "@google/genai";
import readline from "readline";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import figlet from "figlet";
import { exec } from "child_process";
import say from "say";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const speak = (text) => {
    const sanitizedResult =
        typeof text === "string" ? text.replace(/\*/g, "") : text;

    say.speak(sanitizedResult, "Microsoft Heera Desktop", 1.75);
    console.log(chalk.blueBright(`\nJarvis:\n${sanitizedResult}\n`));
};

console.log(
    chalk.cyan(figlet.textSync("J.A.R.V.I.S", { horizontalLayout: "full" }))
);
speak("JARVIS AI Assistant Activated. Type your instructions, sir.");

// === Tool Functions ===
const create_File = ({ fileName, folderName = "default", content }) => {
    const dirPath = path.join("./generated-site", folderName);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, fileName), content);
    updateMemory("lastCreatedFile", path.join(folderName, fileName));
    return `✅ Created ${fileName} in ${folderName}`;
};

const read_File = ({ fileName, folderName = "default" }) => {
    const filePath = path.join("./generated-site", folderName, fileName);
    return fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf-8")
        : `❌ ${fileName} not found in ${folderName}`;
};

const delete_File = ({ fileName, folderName = "default" }) => {
    const filePath = path.join("./generated-site", folderName, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        updateMemory("lastDeletedFile", path.join(folderName, fileName));
        return `🗑️ Deleted ${filePath}`;
    }
    return `❌ ${fileName} not found in ${folderName}`;
};

const list_Files = ({ folderName = "default" }) => {
    const folderPath = path.join("./generated-site", folderName);
    return fs.existsSync(folderPath)
        ? fs.readdirSync(folderPath).join(", ")
        : `❌ Folder '${folderName}' not found`;
};

const append_File = ({ fileName, folderName = "default", content }) => {
    const filePath = path.join("./generated-site", folderName, fileName);
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, content);
        updateMemory("lastAppendedFile", path.join(folderName, fileName));
        return `➕ Appended to ${fileName} in ${folderName}`;
    }
    return `❌ ${fileName} not found in ${folderName}`;
};

const generate_MultiPageWebsite = ({ pages, folder = "default" }) => {
    const dir = `./generated-site/${folder}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    for (const { name, content } of pages) {
        fs.writeFileSync(path.join(dir, name), content);
    }
    updateMemory("lastWebsiteFolder", folder);
    return `🌐 Website created in ${dir} with ${pages.length} pages.`;
};

const run_Command = ({ command }) => {
    exec(command, (error, stdout, stderr) => {
        if (error) speak(`Command failed: ${error.message}`);
        else speak(`Command output: ${stdout}`);
    });
    updateMemory("lastCommand", command);
    return `🧾 Executing command: ${command}`;
};

const runSearch = async ({ query }) => {
    const aiSearch = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const groundingTool = {
        googleSearch: {},
    };
    const config = {
        tools: [groundingTool],
    };
    const response = await aiSearch.models.generateContent({
        model: "gemini-2.0-flash",
        contents: query,
        config,
    });
    return response.text;
};
// === Tool  ===
const toolFunctions = {
    create_File,
    read_File,
    delete_File,
    list_Files,
    append_File,
    generate_MultiPageWebsite,
    run_Command,
    updateMemory,
    recallMemory,
    runSearch,
};

const tools = [
    {
        functionDeclarations: [
            {
                name: "create_File",
                description: "Create file with content",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        fileName: { type: Type.STRING },
                        folderName: { type: Type.STRING },
                        content: { type: Type.STRING },
                    },
                    required: ["fileName", "content"],
                },
            },
            {
                name: "read_File",
                description: "Read file content",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        fileName: { type: Type.STRING },
                        folderName: { type: Type.STRING },
                    },
                    required: ["fileName"],
                },
            },
            {
                name: "delete_File",
                description: "Delete a file",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        fileName: { type: Type.STRING },
                        folderName: { type: Type.STRING },
                    },
                    required: ["fileName"],
                },
            },
            {
                name: "list_Files",
                description: "List files in a folder",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        folderName: { type: Type.STRING },
                    },
                    required: [],
                },
            },
            {
                name: "append_File",
                description: "Append content to file",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        fileName: { type: Type.STRING },
                        folderName: { type: Type.STRING },
                        content: { type: Type.STRING },
                    },
                    required: ["fileName", "content"],
                },
            },
            {
                name: "generate_MultiPageWebsite",
                description: "Generate a multi-page static website",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        folder: { type: Type.STRING },
                        pages: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    content: { type: Type.STRING },
                                },
                                required: ["name", "content"],
                            },
                        },
                    },
                    required: ["pages"],
                },
            },
            {
                name: "run_Command",
                description: "Execute a shell command",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        command: { type: Type.STRING },
                    },
                    required: ["command"],
                },
            },
            {
                name: "runSearch",
                description:
                    "Run a search query.Searches the web for information.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        query: { type: Type.STRING },
                    },
                    required: ["query"],
                },
            },
        ],
    },
];

const systemInstruction = `
You are JARVIS, a powerful CLI AI assistant with tools to:
- Manage files and folders
- Generate full websites
- Launch Next.js projects
- Remember session history
-use runSearch to search the web for information.
if do not understand the user input, ask for clarification.
if you do not know the answer then use the runSearch tool to search the web for information.
just give plain text as output, do not use markdown or any other formatting.
try give short and concise answers.if user ask for details then give details.
convert runSearch result in short and concise answer.
you should only answer in 4-5 sentences.
only give exact answers
Always use tools correctly. Validate your input. Respond confidently and helpfully.`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function processAIResponse(conversation, retries = 0) {
    const MAX_RETRIES = 5;
    if (retries >= MAX_RETRIES) return console.error("❌ Max retries reached.");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: conversation,
            config: {
                tools,
                systemInstruction,
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall) {
            const { name, args } = functionCall;
            const toolFn = toolFunctions[name];
            if (!toolFn) return console.error(`❌ Unknown tool: ${name}`);
            const result = await toolFn(args);
            conversation.push({ role: "model", parts: [{ functionCall }] });
            conversation.push({
                role: "user",
                parts: [{ functionResponse: { name, response: { result } } }],
            });
            return await processAIResponse(conversation, retries + 1);
        } else if (response.candidates?.length) {
            const parts = response.candidates[0]?.content?.parts;
            if (parts?.[0]?.text) speak(parts[0].text);
            else await processAIResponse(conversation, retries + 1);
        }
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

(async () => {
    const conversation = [];
    while (true) {
        const input = await new Promise((resolve) =>
            rl.question("You: ", resolve)
        );
        if (input.toLowerCase() === "quit") {
            speak("Session ended. Goodbye.");
            rl.close();
            break;
        }
        conversation.push({ role: "user", parts: [{ text: input }] });
        await processAIResponse(conversation);
    }
})();
