import { writable } from 'svelte/store';

interface Message {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const scriptErrorLog = writable<Message[]>([]);

export function postScriptMessage(type: Message['type'], message: string) {
  scriptErrorLog.update((log) => [...log, { type, message }]);
}

export function clearScriptMessages() {
  scriptErrorLog.set([]);
}