export function get_current_time() {
    const now = new Date();

    const year = now.getFullYear();
    // getMonth() is 0-indexed, so we add 1. padStart ensures it's always 2 digits.
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Determine AM or PM
    const ampm = hours >= 12 ? "pm" : "am";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;

    return formattedTime;
}
export const getCurrentTimeDescription = {
    name: "get_current_time",
    description: "Get the current time in 'YYYY-MM-DD HH:MM am/pm' format.",
    parameters: {
        type: "object",
        properties: {},
        required: [],
    },
};