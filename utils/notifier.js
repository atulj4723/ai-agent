// utils/notifier.js
import notifier from 'node-notifier';
import path from 'path';

/**
 * Sends a native desktop notification.
 * @param {object} options
 * @param {string} [options.title='JARVIS'] - The title of the notification.
 * @param {string} options.message - The body text of the notification.
 */
export function sendNotification({ title = 'JARVIS', message }) {
    if (!message) {
        console.error("Notification Error: A message is required.");
        return;
    }

    notifier.notify(
        {
            title: title,
            message: message,
            icon: path.join(path.resolve(), 'jarvis-icon.png'), // Optional: Place an icon named 'jarvis-icon.png' in your project root
            sound: true, // Play system notification sound
            wait: false // Do not wait for user to interact
        },
        function (err, response) {
            // Callback function
            if (err) {
                console.error("Notifier Error:", err);
            }
        }
    );
}