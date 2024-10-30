import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { cfg } from '../src/webui.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestTemplatePath = path.join(__dirname, '../src/lib/templates/manifest.json');
const manifestTemplate = JSON.parse(fs.readFileSync(manifestTemplatePath, 'utf-8'));

const pkgPath = path.resolve(__dirname, '../package.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const APP_NAME = pkg.name;
const APP_VERSION = pkg.version;

const dynamicManifest = {
  ...manifestTemplate,
  name:             cfg.APP_TITLE,
  short_name:       cfg.APP_SHORT_NAME,
  description:      cfg.APP_DESCRIPTION,
  theme_color:      cfg.PWA_THEME_COLOR,
  background_color: cfg.PWA_BG_COLOR,
  version:          APP_VERSION,
  scope:            cfg.PWA_SCOPE,
  start_url:        cfg.PWA_START_URL,
  orientation:      cfg.PWA_ORIENTATION
};
dynamicManifest['file_handlers'][0]['action'] = cfg.PWA_FILE_ACTION;
dynamicManifest['file_handlers'][0]['accept'] = {};
dynamicManifest['file_handlers'][0]['accept'][cfg.PWA_FILE_MIME_TYPE] = [cfg.PWA_FILE_EXT];
dynamicManifest['url_handlers'][0]['url_pattern'] = cfg.PWA_URL_PATTERN;

const outputPath = path.join(__dirname, '../static/manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(dynamicManifest, null, 2));

console.log('Dynamic manifest.json created.');
