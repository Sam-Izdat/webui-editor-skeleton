import { writable } from 'svelte/store';
import { onMount } from 'svelte';
import { isDark, currentView } from '$lib/stores/app_state';

// Writable store to track dark mode status

export const isDarkMode = () => {
  return document.documentElement.classList.contains('dark');
};

export const switchMonacoTheme = (editor, theme: string) => {
  editor.setTheme(theme);
};

export const observeThemeChange = (editor) => {
    // Initialize isDark on mount
    isDark.set(isDarkMode());

    const observer = new MutationObserver(() => {
      const theme = isDarkMode() ? 'vs-dark' : 'vs-light';
      switchMonacoTheme(editor, theme);

      // Update the store when the theme changes
      isDark.set(isDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'] // Watch for changes to the class attribute
    });

    // Clean up the observer when component is destroyed
    return () => observer.disconnect();
};