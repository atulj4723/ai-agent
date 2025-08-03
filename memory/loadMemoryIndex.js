import fs from "fs";
import { memory_index } from "../config.js";
export const loadMemoryIndex = () => {
    if (fs.existsSync(memory_index)) {
        try {
            return JSON.parse(fs.readFileSync(memory_index, "utf-8"));
        } catch {
            return [];
        }
    }
    return [];
};