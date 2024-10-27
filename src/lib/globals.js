// __APP_NAME__, __APP_VERSION__ and __BUILD_TYPE__ are provided by vite config

// GENERAL
export const APP_TITLE          = 'Webui Editor Skeleton';
export const APP_SHORT_NAME     = 'WES';
export const APP_DESCRIPTION    = 'A web UI template for code editors.';
export const APP_HOST_PATH      = 'https://sam-izdat.github.io/webui-editor-skeleton/';
export const APP_BASE_PATH      = '/webui-editor-skeleton';
export const APP_THEME          = 'hamlindigo'; // skeleton UI theme

// LOGGING
export const LOG_LEVEL_DEV      = 'DEBUG';
export const LOG_LEVEL_PROD     = 'ERROR';
export const TRACE_LEVEL_DEV    = 'ERROR';
export const TRACE_LEVEL_PROD   = 'CRITICAL';

// PWA
export const PWA_START_URL      = APP_HOST_PATH;
export const PWA_SCOPE          = APP_HOST_PATH;
export const PWA_FILE_EXT       = '.myscript';
export const PWA_FILE_MIME_TYPE = 'application/x-my-custom-script';
export const PWA_FILE_ACTION    = APP_HOST_PATH + 'open-file';
export const PWA_URL_PATTERN    = 'myscript://*';
export const PWA_THEME_COLOR    = '#3B4762';
export const PWA_BG_COLOR       = '#ffffff';
export const PWA_ORIENTATION    = 'any'; // 'landscape' will force PWA into landscape mode at all times