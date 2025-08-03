import { Type } from "@google/genai";


export const tools = [
    {
        functionDeclarations: [
            {
                name: "create_File",
                description: "Create file with content",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        fileName: { type: Type.STRING },
                        folderName: { type: Type.STRING },
                        content: { type: Type.STRING },
                    },
                    required: ["fileName", "content"],
                },
            },
            {
                name: "read_File",
                description: "Read file content",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        fileName: { type: Type.STRING },
                        folderName: { type: Type.STRING },
                    },
                    required: ["fileName"],
                },
            },
            {
                name: "delete_File",
                description: "Delete a file",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        fileName: { type: Type.STRING },
                        folderName: { type: Type.STRING },
                    },
                    required: ["fileName"],
                },
            },
            {
                name: "list_Files",
                description: "List files in a folder",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        folderName: { type: Type.STRING },
                    },
                    required: [],
                },
            },
            {
                name: "append_File",
                description: "Append content to file",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        fileName: { type: Type.STRING },
                        folderName: { type: Type.STRING },
                        content: { type: Type.STRING },
                    },
                    required: ["fileName", "content"],
                },
            },
            {
                name: "generate_MultiPageWebsite",
                description: "Generate a multi-page static website",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        folder: { type: Type.STRING },
                        pages: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    content: { type: Type.STRING },
                                },
                                required: ["name", "content"],
                            },
                        },
                    },
                    required: ["pages"],
                },
            },
            {
                name: "run_Command",
                description: "Execute a shell command",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        command: { type: Type.STRING },
                    },
                    required: ["command"],
                },
            },
            {
                name: "runSearch",
                description:
                    "Run a search query.Searches the web for information.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        query: { type: Type.STRING },
                    },
                    required: ["query"],
                },
            },
            {
                name: "search_memory",
                description:
                    "Searches the long-term memory archives to find relevant past conversations. Use this as the FIRST step when the user asks about something not in the recent chat.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        query: {
                            type: Type.STRING,
                            description:
                                "A search query describing the topic you are looking for.",
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "search_particular_memory",
                description:
                    "SECOND step. After finding a memory with 'search_memory_archives', use this tool with the 'summary_key' to retrieve the full, detailed conversation content.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        query: {
                            type: Type.STRING,
                            description:
                                "The summary_key of the memory you want to retrieve.The unique key for the archive file, e.g., 'summary-123456789.json'.",
                        },
                    },
                    required: ["query"],
                },
            },
        ],
    },
];