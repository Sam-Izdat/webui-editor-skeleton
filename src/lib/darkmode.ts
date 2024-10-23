// Dark-vs-Light mode
export const isDarkMode = () => {
  return document.documentElement.classList.contains('dark');
};

export const switchMonacoTheme = (editor, theme: string) => {
  editor.setTheme(theme);
};

export const observeThemeChange = (editor) => {
  const observer = new MutationObserver(() => {
    const theme = isDarkMode() ? 'vs-dark' : 'vs-light';
    switchMonacoTheme(editor, theme);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'] // Watch for changes to the class attribute
  });
};