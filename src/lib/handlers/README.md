Handlers are made to be "high-level" and as stupid as possible. 

They don't directly involve themselves with UI, nor seek user confirmation or nor actively manage application state. All actions are treated as definitive and final.

This is mostly to keep keep excess code out of out of the SPA +page.svelte.