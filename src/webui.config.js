// __APP_NAME__, __APP_VERSION__ and __BUILD_TYPE__ are provided by vite config

// URL
const APP_HOST_PATH = 'https://sam-izdat.github.io/webui-editor-skeleton/';
const APP_BASE_PATH = '/webui-editor-skeleton';

export const cfg = {
  APP_HOST_PATH,
  APP_BASE_PATH,

  // GENERAL
  APP_TITLE:        'Webui Editor Skeleton',
  APP_SHORT_NAME:   'WES',
  APP_DESCRIPTION:  'A web UI template for code editors.',  
  APP_THEME:        'hamlindigo', // skeleton UI theme

  // LOGGING
  LOG_LEVEL_DEV:     'DEBUG',
  LOG_LEVEL_PROD:    'ERROR',
  TRACE_LEVEL_DEV:   'ERROR',
  TRACE_LEVEL_PROD:  'CRITICAL',

  // PWA
  PWA_START_URL:     APP_HOST_PATH,
  PWA_SCOPE:         APP_HOST_PATH,
  PWA_FILE_EXT:      '.myscript',
  PWA_FILE_MIME_TYPE:'application/x-my-custom-script',
  PWA_FILE_ACTION:   APP_HOST_PATH + 'open-file',
  PWA_URL_PATTERN:   'myscript://*',
  PWA_THEME_COLOR:   '#3B4762',
  PWA_BG_COLOR:      '#ffffff',
  PWA_ORIENTATION:   'any',   // 'landscape' will force PWA into landscape mode at all times

  // the programming language monaco editor should use
  EDITOR_LANGUAGE:    'c',    
  // attempt to guess at "raw" URLs if given an HTML page address to import
  GUESS_RAW_URL:      true,   
  // start mobile clients in 'read-only' mode (prevent keyboard from popping up until user enables editing)
  MOBILE_READONLY:    true,
};