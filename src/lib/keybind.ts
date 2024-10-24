export const initKeyboardShortcuts = () => {
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    // CTRL + S for save
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('save-document'));
    }

    // Switch views with tilde (~), 1, 2, 3 keys
    if ((event.altKey && event.key) === '`' || 
        (event.altKey && event.key) === '1' || 
        (event.altKey && event.key) === '2' || 
        (event.altKey && event.key) === '3') {
      const view = event.altKey && event.key === '`' ? 0 : +event.key;
      window.dispatchEvent(new CustomEvent('switch-view', { detail: { view } }));
    }
  });
};