import fs from "fs";
export const read_user_task = ({})=>{
    const filePath = "userstask.txt";
    try {
        const data = fs.readFileSync(filePath, "utf8");
        if (data.trim() === "") {
            return { result: `No tasks found in ${filePath}.` };
        }
        return { result: `Tasks in ${filePath}:\n${data}` };
    } catch (error) {
        return {
            result: `❌ Failed to read tasks from ${filePath}. Error: ${error.message}`,
        };
    }
}
export const readUserTaskDescription = {
    name: "read_user_task",
    description:
        "A tool to read user-defined tasks from userstask.txt. These tasks can be executed later by the user. AI will not execute these tasks automatically. It will notify the user about these tasks.",
    parameters: {
        type: "object",
        properties: {},
        required: [],
    },
};