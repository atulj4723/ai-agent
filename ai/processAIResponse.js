import { ai } from "../config.js";
import { saveConversationHistory } from "../memory/saveConversationHistory.js";
import { analyze_image } from "../tools/AITools/analyze_image.js";
import { append_File } from "../tools/fileManagementTools/append_File.js";
import { create_File } from "../tools/fileManagementTools/create_File.js";
import { delete_File } from "../tools/fileManagementTools/delete_File.js";
import { generate_directory_tree } from "../tools/fileManagementTools/generate_directory_tree.js";
import { generate_MultiPageWebsite } from "../tools/webTools/generate_MultiPageWebsite.js";
import { get_current_time } from "../tools/basic/get_current_time.js";
import { read_File } from "../tools/fileManagementTools/read_File.js";
import { run_Command } from "../tools/basic/run_Command.js";
import { runSearch } from "../tools/AITools/runSearch.js";
import { search_memory } from "../tools/memoryTools/search_memory.js";
import { search_particular_memory } from "../tools/memoryTools/search_particular_memory.js";
import { AIconfig } from "../tools/tools.js";
import { speak } from "../utils/speak.js";
import { open_file } from "../tools/basic/open_file.js";
import { add_user_task } from "../tools/basic/add_user_task.js";
import { read_user_task } from "../tools/basic/read_user_task.js";
import { schedule_task, set_reminder } from "../tools/basic/reminder.js";
// === Tool  ===
const toolFunctions = {
    create_File,
    read_File,
    delete_File,
    append_File,
    generate_MultiPageWebsite,
    run_Command,
    runSearch,
    search_memory,
    search_particular_memory,
    analyze_image,
    generate_directory_tree,
    get_current_time,
    open_file,
    add_user_task,
    read_user_task,
    set_reminder,
    schedule_task,
};

export async function processAIResponse(conversation, retries = 0) {
    const MAX_RETRIES = 10;
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
                return text;
            } else await processAIResponse(conversation, retries + 1);
        }
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}
