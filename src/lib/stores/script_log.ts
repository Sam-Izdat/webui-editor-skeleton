import { writable } from 'svelte/store';

// Define message structure
interface Message {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

// Initialize writable store for message queue
export const errorLog = writable<Message[]>([]);

// Add message to queue
export function postScriptMessage(type: Message['type'], message: string) {
  errorLog.update((log) => [...log, { type, message }]);
}

// Clear queue if needed
export function clearScriptMessages() {
  errorLog.set([]);
}