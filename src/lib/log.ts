import * as g from '$lib/globals';

export class Log {
  static #instance = null;

  static Level = class {
    static DEBUG    = 1<<0;
    static INFO     = 1<<1;
    static WARNING  = 1<<2;
    static ERROR    = 1<<3;
    static CRITICAL = 1<<4;
  };

  static debug    = (...msg) => Log.get_instance().debug(...msg);
  static info     = (...msg) => Log.get_instance().info(...msg);
  static warning  = (...msg) => Log.get_instance().warning(...msg);
  static error    = (...msg) => Log.get_instance().error(...msg);
  static critical = (...msg) => Log.get_instance().critical(...msg);

  constructor(log_level = Log.Level.ERROR, trace_level = Log.Level.ERROR) {
    if (Log.#instance) {
      return Log.#instance;
    }
    Log.#instance = this;
    
    this.level        = log_level;
    this.trace_level  = trace_level;
  }

  static get_instance = () => !Log.#instance ? new Log() : Log.#instance;

  debug = (...msg) => {
    if (this.level <= Log.Level.DEBUG) { 
      console.log(`[${g.APP_SHORT_NAME}][DBG]`, ...msg); 
      if (this.trace_level <= Log.Level.DEBUG) { 
        console.trace('TRACE'); 
      } 
    }
  };

  info = (...msg) => {
    if (this.level <= Log.Level.DEBUG) { 
      console.info(`[${g.APP_SHORT_NAME}][INF]`,...msg); 
      if (this.trace_level <= Log.Level.INFO) { 
        console.trace('TRACE'); 
      } 
    }
  };

  warning = (...msg) => {
    if (this.level <= Log.Level.WARNING) { 
      console.warn(`[${g.APP_SHORT_NAME}][WRN]`, ...msg); 
      if (this.trace_level <= Log.Level.WARNING) { 
        console.trace('TRACE'); 
      } 
    }
  };

  error = (...msg) => {
    if (this.level <= Log.Level.ERROR) {
      console.error(`[${g.APP_SHORT_NAME}][ERR]`, ...msg); 
      if (this.trace_level <= Log.Level.ERROR) { 
        console.trace('TRACE'); 
      }
    }
  };

  critical = (...msg) => {
    if (this.level <= Log.Level.CRITICAL) { 
      console.error(`[${g.APP_SHORT_NAME}][**CRIT**]`, ...msg);
      if (this.trace_level <= Log.Level.CRITICAL) { 
        console.trace('TRACE'); 
      } 
    }
  };
}