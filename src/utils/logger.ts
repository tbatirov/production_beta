type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data ? this.sanitizeData(data) : undefined
    };

    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // Always log to console for debugging
    const logStyle = `color: ${
      level === 'error' ? 'red' : 
      level === 'warn' ? 'orange' : 
      level === 'info' ? 'blue' : 
      'gray'
    }; font-weight: bold;`;

    console.log(
      `%c[${level.toUpperCase()}] ${message}`, 
      logStyle,
      data
      //data ? '\n' + JSON.stringify(data, null, 2) : ''
    );
  }

  private sanitizeData(data: any): any {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch {
      return '[Circular or Non-Serializable Data]';
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();