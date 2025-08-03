
import { ai } from "../config.js";
import { saveConversationHistory } from "../memory/saveConversationHistory.js";
import { append_File } from "../tools/append_File.js";
import { create_File } from "../tools/create_File.js";
import { delete_File } from "../tools/delete_File.js";
import { generate_MultiPageWebsite } from "../tools/generate_MultiPageWebsite.js";
import { list_Files } from "../tools/list_Files.js";
import { read_File } from "../tools/read_File.js";
import { run_Command } from "../tools/run_Command.js";
import { runSearch } from "../tools/runSearch.js";
import { search_memory } from "../tools/search_memory.js";
import { search_particular_memory } from "../tools/search_particular_memory.js";
import { tools } from "../tools/tools.js";
import { speak } from "../utils/speak.js";

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
export async function processAIResponse(conversation, retries = 0) {
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
