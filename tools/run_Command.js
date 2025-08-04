import { exec } from "child_process";
export function run_Command({ command }) {

    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                // If the command fails, resolve with the error message.
                console.error(`exec error: ${error.message}`);
                resolve(`Command failed to execute. Error: ${error.message}`);
                return;
            }
            if (stderr) {
                // Handle cases where there's an error output but the command didn't crash.
                console.log(`stderr: ${stderr}`);
                resolve(`Command executed. Standard Error: ${stderr}\nStandard Output: ${stdout}`);
                return;
            }
            // If successful, resolve with the standard output.
            resolve(`Command executed successfully. Output:\n${stdout}`);
        });
    });
}
export const run_CommandDescription = {
    name: "run_Command",
    description: "Execute a shell command",
    parameters: {
        type: "object",
        properties: {
            command: { type: "string" },
        },
        required: ["command"],
    },
};