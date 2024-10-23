// scripts/generate-manifest.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Import global variables from globals.js
import * as g from '../src/lib/globals.js';

// Enable ES module compatible path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the manifest template
const manifestTemplatePath = path.join(__dirname, '../src/lib/manifest-template.json');
const manifestTemplate = JSON.parse(fs.readFileSync(manifestTemplatePath, 'utf-8'));

// Resolve the path to package.json relative to this file
const pkgPath = path.resolve(__dirname, '../package.json');

// Load package.json dynamically
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const APP_NAME = pkg.name;
const APP_VERSION = pkg.version;

// Modify the template with dynamic data from globals.js
const dynamicManifest = {
  ...manifestTemplate,
  name:             g.APP_TITLE,
  short_name:       g.APP_SHORT_NAME,
  description:      g.APP_DESCRIPTION,
  theme_color:      g.PWA_THEME_COLOR,
  background_color: g.PWA_BG_COLOR,
  version:          APP_VERSION,
  scope:            g.PWA_SCOPE,
  start_url:        g.PWA_START_URL,
  orientation:      g.PWA_ORIENTATION
};
dynamicManifest['file_handlers'][0]['action'] = g.PWA_FILE_ACTION;
dynamicManifest['file_handlers'][0]['accept'] = {};
dynamicManifest['file_handlers'][0]['accept'][g.PWA_FILE_MIME_TYPE] = [g.PWA_FILE_EXT];
dynamicManifest['url_handlers'][0]['url_pattern'] = g.PWA_URL_PATTERN;

// Write the dynamic manifest to the static folder
const outputPath = path.join(__dirname, '../static/manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(dynamicManifest, null, 2));

console.log('Dynamic manifest.json created.');
