import fs from "fs";

export async function add_user_task({ task_description }) {
    const filePath = "userstask.txt";
    try {
        await fs.appendFile(filePath, task_description + "\n");
        return { result: `Task "${task_description}" added to ${filePath}.` };
    } catch (error) {
        return {
            result: `❌ Failed to add task to ${filePath}. Error: ${error.message}`,
        };
    }
}

export const userTaskDescription = {
    name: "user_task",
    description:
        "A tool to manage user-defined tasks by adding them to userstask.txt.These tasks can be executed later by the user.AI will not execute these tasks automatically.It will notify the user about these tasks.Check if there are any tasks in userstask.txt before adding a new task.",
    parameters: {
        type: "object",
        properties: {
            task_description: {
                type: "string",
                description: "The description of the task to be added.",
            },
        },
        required: ["task_description"],
    },
};
