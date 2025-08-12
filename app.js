import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { processAIResponse } from "./ai/processAIResponse.js";
import { loadConversationHistory } from "./memory/loadConversationHistory.js";
import { saveConversationHistory } from "./memory/saveConversationHistory.js";
import { summarizeConversation } from "./ai/summarizeConversation.js";

async function processsTask(conversation, respond) {
    await processAIResponse(conversation);
    conversation = await summarizeConversation(conversation);
    saveConversationHistory(conversation);
    respond(conversation);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 3000;

// Set up EJS as the view engine
app.set("views", "./views");
app.set("view engine", "ejs");
// Serve the main web page from the root URL
app.get("/", (req, res) => {
    res.render("index");
});
let conversation = (await loadConversationHistory()) || [];

// Handle the real-time communication
io.on("connection", (socket) => {
    console.log("A user connected via web browser.");

    // You can load conversation history per-session if needed
    // Example: start with a fresh conversation
    socket.emit("jarvis_response", conversation);
    // Listen for a 'user_command' event from the browser
    socket.on("user_command", async (command) => {
        conversation.push({ role: "user", parts: [{ text: command }] });

        // This function will be used by JARVIS to send messages back to this specific user
        const respond = (text) => {
            socket.emit("jarvis_response", text);
        };

        // Call your main AI logic, passing it the conversation and the way to respond
        await processsTask(conversation, respond);

        // You would still save the history after the interaction
        // saveConversationHistory(conversation);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected.");
    });
});

httpServer.listen(port, () => {
    console.log(`JARVIS is now accessible at http://localhost:${port}`);
});
