import * as g from '$lib/globals';
import { postScriptMessage, clearScriptMessages } from '$lib/stores';
import { writable } from 'svelte/store';
import { getToastStore } from '@skeletonlabs/skeleton';

// Singleton, because it's convenient here
export class Log {
  static #instance = null;

  static Level = class {
    static DEBUG    = 1<<0;
    static INFO     = 1<<1;
    static WARNING  = 1<<2;
    static ERROR    = 1<<3;
    static CRITICAL = 1<<4;
  };

  static ScriptStatus = class {
    static SUCCESS  = 1<<0;
    static WARNING  = 1<<1;
    static ERROR    = 1<<2;
  };

  static debug          = (...msg)  => Log.getInstance().debug(...msg);
  static info           = (...msg)  => Log.getInstance().info(...msg);
  static warning        = (...msg)  => Log.getInstance().warning(...msg);
  static error          = (...msg)  => Log.getInstance().error(...msg);
  static critical       = (...msg)  => Log.getInstance().critical(...msg);

  static toastInfo      = (...msg)  => Log.getInstance().toastInfo(...msg);
  static toastSuccess   = (...msg)  => Log.getInstance().toastSuccess(...msg);
  static toastWarning   = (...msg)  => Log.getInstance().toastWarning(...msg);
  static toastError     = (...msg)  => Log.getInstance().toastError(...msg);

  static scriptInfo     = (...msg)  => Log.getInstance().scriptInfo(...msg);
  static scriptSuccess  = (...msg)  => Log.getInstance().scriptSuccess(...msg);
  static scriptWarning  = (...msg)  => Log.getInstance().scriptWarning(...msg);
  static scriptError    = (...msg)  => Log.getInstance().scriptError(...msg);
  static clearScriptLog = ()        => Log.getInstance().clearScriptLog();

  constructor(options = {}) {
    if (Log.#instance) return Log.#instance;
    Log.#instance = this;
    
    const {
      baseLogLevel    = Log.Level.ERROR,
      baseTraceLevel  = Log.Level.ERROR,
      toastStore      = getToastStore()
    } = options;
    
    this.level            = baseLogLevel;
    this.baseTraceLevel   = baseTraceLevel;
    this.toastStore       = toastStore;
    this.scriptStatus     = writable(0);
  }

  static getInstance = () => !Log.#instance ? new Log() : Log.#instance;

  debug = (...msg) => {
    if (this.level <= Log.Level.DEBUG) {
      console.log(`[${g.APP_SHORT_NAME}][DBG]`, ...msg); 
      if (this.baseTraceLevel <= Log.Level.DEBUG) { 
        console.trace('TRACE'); 
      } 
    }
  };

  info = (...msg) => {
    if (this.level <= Log.Level.DEBUG) { 
      console.info(`[${g.APP_SHORT_NAME}][INF]`,...msg); 
      if (this.baseTraceLevel <= Log.Level.INFO) { 
        console.trace('TRACE'); 
      } 
    }
  };

  warning = (...msg) => {
    if (this.level <= Log.Level.WARNING) { 
      console.warn(`[${g.APP_SHORT_NAME}][WRN]`, ...msg); 
      if (this.baseTraceLevel <= Log.Level.WARNING) { 
        console.trace('TRACE'); 
      } 
    }
  };

  error = (...msg) => {
    if (this.level <= Log.Level.ERROR) {
      console.error(`[${g.APP_SHORT_NAME}][ERR]`, ...msg); 
      if (this.baseTraceLevel <= Log.Level.ERROR) { 
        console.trace('TRACE'); 
      }
    }
  };

  critical = (...msg) => {
    if (this.level <= Log.Level.CRITICAL) { 
      console.error(`[${g.APP_SHORT_NAME}][**CRIT**]`, ...msg);
      if (this.baseTraceLevel <= Log.Level.CRITICAL) { 
        console.trace('TRACE'); 
      } 
    }
  };

  toastInfo = (...msg) => {
    if (this.toastStore){
      const t: ToastSettings = {
        message: msg,
        background: 'variant-filled-primary',
        classes: 'p-2'
      };
      this.toastStore.trigger(t); 
    }
  };

  toastSuccess = (...msg) => {
    if (this.toastStore){
      const t: ToastSettings = {
        message: msg,
        background: 'variant-filled-success',
        classes: 'm-2'
      };
      this.toastStore.trigger(t); 
    }
  };

  toastWarning = (...msg) => {
    if (this.toastStore){
      const t: ToastSettings = {
        message: msg,
        background: 'variant-filled-warning',
        classes: 'm-2'
      };
      this.toastStore.trigger(t); 
    }
  };

  toastError = (...msg) => {
    if (this.toastStore){
      const t: ToastSettings = {
        message: msg,
        background: 'variant-filled-error',
        classes: 'm-2'
      };
      this.toastStore.trigger(t); 
    }
  };

  scriptInfo      = (...msg)  => {
    postScriptMessage('info', msg);
  }
  scriptSuccess   = (...msg)  => {
    this.scriptStatus.update(status => status | Log.ScriptStatus.SUCCESS);
    postScriptMessage('success', msg);
  };
  scriptWarning   = (...msg)  => {
    this.scriptStatus.update(status => status | Log.ScriptStatus.WARNING);
    postScriptMessage('warning', msg);
  };
  scriptError     = (...msg)  => {
    this.scriptStatus.update(status => status | Log.ScriptStatus.ERROR);
    postScriptMessage('error', msg);
  };
  clearScriptLog  = ()        => { 
    this.scriptStatus.set(0);
    clearScriptMessages();
  };
}