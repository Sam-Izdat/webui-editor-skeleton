Handlers are made to expose "high-level" abstractions and are written to be as stupid as possible. 

They don't directly involve themselves with UI (except for notification "toasts"), 
nor seek user confirmation, nor actively manage application state.  
The may respond to global state changes. All actions are treated 
as definitive and final.

This is mostly to keep excess code out of the SPA +page.svelte file.