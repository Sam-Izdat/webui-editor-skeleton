import { writable } from 'svelte/store';
import { onMount } from 'svelte';

// Writable store to track dark mode status
export const darkModeStore = writable(false);

export const isDarkMode = () => {
  return document.documentElement.classList.contains('dark');
};

export const switchMonacoTheme = (editor, theme: string) => {
  editor.setTheme(theme);
};

export const observeThemeChange = (editor) => {
    // Initialize darkModeStore on mount
    darkModeStore.set(isDarkMode());

    const observer = new MutationObserver(() => {
      const theme = isDarkMode() ? 'vs-dark' : 'vs-light';
      switchMonacoTheme(editor, theme);

      // Update the store when the theme changes
      console.log('ISDARKMODE', isDarkMode());
      darkModeStore.set(isDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'] // Watch for changes to the class attribute
    });

    // Clean up the observer when component is destroyed
    return () => observer.disconnect();
};