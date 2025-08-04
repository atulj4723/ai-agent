import { ai } from "../config.js";
import { saveConversationHistory } from "../memory/saveConversationHistory.js";
import { analyze_image } from "../tools/analyze_image.js";
import { append_File } from "../tools/append_File.js";
import { create_File } from "../tools/create_File.js";
import { delete_File } from "../tools/delete_File.js";
import { generate_directory_tree } from "../tools/generate_directory_tree.js";
import { generate_MultiPageWebsite } from "../tools/generate_MultiPageWebsite.js";
//import { list_Files } from "../tools/list_Files.js";
import { read_File } from "../tools/read_File.js";
import { run_Command } from "../tools/run_Command.js";
import { runSearch } from "../tools/runSearch.js";
import { search_memory } from "../tools/search_memory.js";
import { search_particular_memory } from "../tools/search_particular_memory.js";
import { AIconfig } from "../tools/tools.js";
import { speak } from "../utils/speak.js";

// === Tool  ===
const toolFunctions = {
    create_File,
    read_File,
    delete_File,
    //list_Files,
    append_File,
    generate_MultiPageWebsite,
    run_Command,
    runSearch,
    search_memory,
    search_particular_memory,
    analyze_image,
    generate_directory_tree,
};

export async function processAIResponse(conversation, retries = 0) {
    const MAX_RETRIES = 5;
    if (retries >= MAX_RETRIES) return console.error("❌ Max retries reached.");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: conversation,
            config: AIconfig,
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
