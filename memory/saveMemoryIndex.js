import fs from "fs";
import { memory_index } from "../config.js";
export const saveMemoryIndex = (index) => {
    fs.writeFileSync(memory_index, JSON.stringify(index, null, 2));
};