import { writable } from 'svelte/store';

// Define message structure
interface Message {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

// Initialize a writable store for the message queue
export const errorLog = writable<Message[]>([]);

// Function to add a message to the queue
export function postScriptMessage(type: Message['type'], message: string) {
  errorLog.update((log) => [...log, { type, message }]);
}

// Function to clear the queue if needed
export function clearScriptMessages() {
  errorLog.set([]);
}