import cron from 'node-cron';
import { speak } from '../../utils/speak.js';
import { sendNotification } from '../../utils/notifier.js';

export function set_reminder({ minutes, reminder_text }) {
    const delay = parseInt(minutes, 10) * 60 * 1000;
    if (isNaN(delay) || delay <= 0) {
        return "❌ Error: Please provide a valid number of minutes.";
    }

    setTimeout(() => {
        const message = `Sir, this is your reminder: ${reminder_text}`;
        speak(message);
        sendNotification({
            title: 'JARVIS Reminder',
            message: reminder_text
        });
    }, delay);

    return `✅ Understood. I will remind you about "${reminder_text}" in ${minutes} minute(s).`;
}

export function schedule_task({ schedule, task_description }) {
    if (!cron.validate(schedule)) {
        return `❌ Error: Invalid cron schedule format: '${schedule}'. Please provide a valid cron string.`;
    }
    cron.schedule(schedule, async () => {
        const message = `Executing scheduled task: ${task_description}`;
        console.log(`\n[CRON] Running scheduled task: ${task_description}`);
        speak(message);
        sendNotification({ title: 'JARVIS Scheduled Task', message: task_description });
    });
    return `✅ Task scheduled. I will execute '${task_description}' based on the schedule: '${schedule}'.`;
}
export const reminderDescription = {
    name: 'set_reminder',
    description: 'Set a reminder for a specific time in minutes.Use current time as the reference point.Use get_current_time tool to get current time.',
    parameters: {
        type: 'object',
        properties: {
            minutes: {
                type: 'string',
                description: 'The number of minutes after which the reminder should be triggered.',
            },
            reminder_text: {
                type: 'string',
                description: 'The text of the reminder to be spoken and displayed.',
            },
        },
        required: ['minutes', 'reminder_text'],
    },
};
export const scheduleTaskDescription = {
    name: 'schedule_task',
    description: 'Schedule a task to be executed at a specific time using cron syntax.',
    parameters: {
        type: 'object',
        properties: {
            schedule: {
                type: 'string',
                description: 'The cron schedule string defining when the task should run.',
            },
            task_description: {
                type: 'string',
                description: 'The description of the task to be executed on the scheduled time.',
            },
        },
        required: ['schedule', 'task_description'],
    },
};