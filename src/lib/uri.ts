// Loading custom URI resource
// window.addEventListener('load', () => {
//   // Check if the app was opened with a custom URI
//   const url = window.location.href;
//   if (url.startsWith('myscript://')) {
//     const address = url.replace('myscript://', ''); // Extract the address
//     // Handle the custom address accordingly
//     console.log('Custom URI Address:', address);
//   }
// });


// Ways to check for PWA vs hosted status:

// const isPWA = window.matchMedia('(display-mode: standalone)').matches;
// const isPWA = navigator.userAgent.includes('MyApp'); // Replace 'MyApp' with your app's identifier
// const isPWA = window.navigator.standalone === true; // Works on iOS
// const isPWA = 'serviceWorker' in navigator;

// if (window.matchMedia('(display-mode: standalone)').matches) {
//   sessionStorage.setItem('isPWA', 'true');
// }


  // const response = await fetch(`https://api.github.com/gists/${gistId}`);
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch gist: ${response.statusText}`);
  // }

  // const gist = await response.json();
  // const files = {};

  // for (const [filename, fileData] of Object.entries(gist.files)) {
  //   files[filename] = fileData;
  // }

  // if (!files['index.md']) {
  //   throw new Error('No index.md file found in the gist');
  // }

  // return files;

// <script lang="ts">
//   import { onMount } from 'svelte';

//   let isPWA = false;
//   let textToSave = '';
//   const serverUrl = '/api/save-text'; // Replace with your actual server endpoint

//   onMount(() => {
//     // Check if the app is running in standalone mode
//     isPWA = window.matchMedia('(display-mode: standalone)').matches;
//   });

//   async function saveText() {
//     if (isPWA) {
//       // Send the text to the server
//       try {
//         const response = await fetch(serverUrl, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ text: textToSave })
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         console.log('Text saved on the server:', textToSave);
//       } catch (error) {
//         console.error('Error saving text on server:', error);
//       }
//     } else {
//       // Save the text to local storage
//       localStorage.setItem('savedText', textToSave);
//       console.log('Text saved in local storage:', textToSave);
//     }
//   }
// </script>

// <h1>{isPWA ? 'Using PWA' : 'Using Web App'}</h1>

// <textarea bind:value={textToSave} placeholder="Enter text here..."></textarea>
// <button on:click={saveText}>Save Text</button>


// Keeping API keys out of PWA bundle:
// src/routes/+server.js or src/routes/+server.ts will run on the server only
// Inside a server route or API logic
// if (import.meta.env.VITE_IS_HOSTED) {
//   // Fetch secrets from the environment for server-side logic
//   const apiKey = process.env.API_KEY;
//   // Only the hosted version will use this
// }