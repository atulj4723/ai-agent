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
const conversation_limit = 30;
const messagesToSummerize = 16;
const conversationHistoryFile = "./conversation_history.json";
const conversationHistoryAllTimeFolder = "./history";
const memory_index = "./memory_index.json";
if (!fs.existsSync(conversationHistoryAllTimeFolder)) {
    fs.mkdirSync(conversationHistoryAllTimeFolder, { recursive: true });
}

const loadConversationHistory = () => {
    if (fs.existsSync(conversationHistoryFile)) {
        try {
            return JSON.parse(
                fs.readFileSync(conversationHistoryFile, "utf-8")
            );
        } catch {
            return [];
        }
    }
    return [];
};
const saveConversationHistory = (conversation) => {
    fs.writeFileSync(
        conversationHistoryFile,
        JSON.stringify(conversation, null, 2)
    );
};
const loadMemoryIndex = () => {
    if (fs.existsSync(memory_index)) {
        try {
            return JSON.parse(fs.readFileSync(memory_index, "utf-8"));
        } catch {
            return [];
        }
    }
    return [];
};
const saveMemoryIndex = (index) => {
    fs.writeFileSync(memory_index, JSON.stringify(index, null, 2));
};
const summarizeConversation = async (conversation) => {
    if (conversation.length === 0) return [];
    if (conversation.length <= conversation_limit) return conversation;
    console.log(
        chalk.yellow(
            "\n[SYSTEM] Conversation limit reached. Initiating summarization..."
        )
    );
    speak(
        "My short-term memory is getting full. Performing a summarization and archiving procedure."
    );
    const toSummarize = conversation.slice(0, messagesToSummerize);
    const toKeep = conversation.slice(messagesToSummerize);
    try {
        const summaryResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { tools: [] }, // No tools needed for summarization
            contents: `Concisely summarize the key points, facts, and topics from this conversation: ${JSON.stringify(
                toSummarize
            )}`,
        });
        const summary = summaryResponse.candidates[0].content.parts[0].text;
        console.log(summary);
        const keywordsResult = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { tools: [] }, // No tools needed for keyword extraction
            contents: `Based on the following summary, generate a list of 5-7 relevant JSON keywords in an array format (e.g., ["keyword1", "keyword2"]): "${summary}".Only give valid  array of keywords.`,
        });
        let keywords = [];
        try {
            keywords = JSON.parse(
                keywordsResult.response.text().replace(/```json\n?|```/g, "")
            );
        } catch {
            keywords = summary
                .toLowerCase()
                .split(" ")
                .filter((word) => word.length > 3)
                .slice(0, 5); // Fallback
        }
        const summaryKey = `summary-${Date.now()}.json`;
        const historyPath = path.join(
            conversationHistoryAllTimeFolder,
            summaryKey
        );
        fs.writeFileSync(historyPath, JSON.stringify(toSummarize, null, 2));

        let memoryIndex = loadMemoryIndex();
        memoryIndex.push({
            key: summaryKey,
            timestamp: Date.now(),
            summary: summary,
            keywords,
        });
        saveMemoryIndex(memoryIndex);
        const systemMessage = {
            role: "model",
            parts: [
                {
                    text: `Conversation summarized and archived. Summary: ${summary}`,
                },
            ],
        };
        return [systemMessage, ...toKeep];
    } catch (error) {
        console.error("Error during summarization:", error);
        return conversation;
    }
};
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
    const dirPath = path.join("./generated-content", folderName);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, fileName), content);
    return `✅ Created ${fileName} in ${folderName}`;
};

const read_File = ({ fileName, folderName = "default" }) => {
    const filePath = path.join("./generated-content", folderName, fileName);
    return fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf-8")
        : `❌ ${fileName} not found in ${folderName}`;
};

const delete_File = ({ fileName, folderName = "default" }) => {
    const filePath = path.join("./generated-content", folderName, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return `🗑️ Deleted ${filePath}`;
    }
    return `❌ ${fileName} not found in ${folderName}`;
};

const list_Files = ({ folderName = "default" }) => {
    const folderPath = path.join("./generated-content", folderName);
    return fs.existsSync(folderPath)
        ? fs.readdirSync(folderPath).join(", ")
        : `❌ Folder '${folderName}' not found`;
};

const append_File = ({ fileName, folderName = "default", content }) => {
    const filePath = path.join("./generated-content", folderName, fileName);
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, content);

        return `➕ Appended to ${fileName} in ${folderName}`;
    }
    return `❌ ${fileName} not found in ${folderName}`;
};

const generate_MultiPageWebsite = ({ pages, folder = "default" }) => {
    const dir = `./generated-content/${folder}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    for (const { name, content } of pages) {
        fs.writeFileSync(path.join(dir, name), content);
    }
    return `🌐 Website created in ${dir} with ${pages.length} pages.`;
};

const run_Command = ({ command }) => {
    exec(command, (error, stdout, stderr) => {
        if (error) speak(`Command failed: ${error.message}`);
        else speak(`Command output: ${stdout}`);
    });
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
const search_memory = ({ query }) => {
    const memoryIndex = loadMemoryIndex();
    const searchTerms = query.toLowerCase().split(" ");
    const results = memoryIndex
        .map((item) => {
            let score = 0;
            const combinedText = `${item.summary.toLowerCase()} ${item.keywords.join(
                " "
            )}`;
            searchTerms.forEach((term) => {
                if (combinedText.includes(term)) {
                    score++;
                }
            });
            return { ...item, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    if (results.length === 0) {
        return `❌ No relevant memories found for "${query}".`;
    }
    const resultForAI = results.map((r) => ({
        key: r.key,
        summary: r.summary,
    }));
    return (
        `Found ${results.length} relevant memory blocks. Here are the summaries and keys: ` +
        JSON.stringify(resultForAI)
    );
};
const search_particular_memory = ({ query }) => {
    const filePath = path.join(conversationHistoryAllTimeFolder, query);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        return `Successfully retrieved details from archive ${query}. Here is the original conversation snippet: ${content}`;
    }
    return `❌ Memory block "${query}" not found.`;
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
    runSearch,
    search_memory,
    search_particular_memory,
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
            {
                name: "search_memory",
                description:
                    "Searches the long-term memory archives to find relevant past conversations. Use this as the FIRST step when the user asks about something not in the recent chat.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        query: {
                            type: Type.STRING,
                            description:
                                "A search query describing the topic you are looking for.",
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "search_particular_memory",
                description:
                    "SECOND step. After finding a memory with 'search_memory_archives', use this tool with the 'summary_key' to retrieve the full, detailed conversation content.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        query: {
                            type: Type.STRING,
                            description:
                                "The summary_key of the memory you want to retrieve.The unique key for the archive file, e.g., 'summary-123456789.json'.",
                        },
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
Always use tools correctly. Validate your input. 
Your active conversation is kept short. 
Older parts are archived and indexed. 
To access your long-term memory, you MUST follow this two-step process: 
1. **SEARCH**: Use the 'search_memory_archives' tool with a search query to find relevant memory blocks. 
This tool will return a list of summaries and their keys.
2. **RETRIEVE**: From the search results, pick the most relevant 'summary_key' and use the 'get_archived_summary_details' tool to get the full content. 
NEVER assume you have the full history. 
Always search your archives for past topics if the user asks about something you don't immediately see in the short active chat.`;

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
            if (!toolFn) {
                conversation.push({
                    role: "model",
                    parts: [
                        {
                            text: `❌ Unknown tool function: ${name}. Please check the tool name.`,
                        },
                    ],
                });
                return await processAIResponse(conversation, retries + 1);
            }
            const result = await toolFn(args);
            conversation.push({ role: "model", parts: [{ functionCall }] });
            conversation.push({
                role: "user",
                parts: [{ functionResponse: { name, response: { result } } }],
            });
            return await processAIResponse(conversation, retries + 1);
        } else if (response.candidates?.length) {
            const parts = response.candidates[0]?.content?.parts;
            if (parts?.[0]?.text) {
                const text = parts[0].text;
                conversation.push({ role: "model", parts });
                saveConversationHistory(conversation);
                speak(text);
            } else await processAIResponse(conversation, retries + 1);
        }
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}
// Load conversation history
let conversation = loadConversationHistory() || [];
(async () => {
    while (true) {
        const input = await new Promise((resolve) =>
            rl.question("You: ", resolve)
        );
        if (input.toLowerCase() === "quit") {
            speak("Session ended. Goodbye.");
            rl.close();
            break;
        }
        console.log(conversation.length);
        conversation.push({ role: "user", parts: [{ text: input }] });
        await processAIResponse(conversation);
        conversation = await summarizeConversation(conversation);
        saveConversationHistory(conversation);
    }
})();
