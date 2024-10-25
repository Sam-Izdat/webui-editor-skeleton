import { writable } from 'svelte/store';

// Define message structure
interface Message {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

// Initialize writable store for message queue
export const scriptErrorLog = writable<Message[]>([]);

// Add message to queue
export function postScriptMessage(type: Message['type'], message: string) {
  scriptErrorLog.update((log) => [...log, { type, message }]);
}

// Clear queue if needed
export function clearScriptMessages() {
  scriptErrorLog.set([]);
}