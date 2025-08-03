import { exec } from "child_process";
export const run_Command = ({ command }) => {
    exec(command, (error, stdout, stderr) => {
        if (error) console.log(`Command failed: ${error.message}`);
        else console.log(`Command output: ${stdout}`);
    });
    return `🧾 Executing command: ${command}`;
};
