import { Firestore } from '@angular/fire/firestore';
import { uuidv4 } from '@firebase/util';
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { ILogEntry } from '../../environments/interfaces.environment';
import { LogLevel } from '../../enumerations/logLevel';

export class LoggingService {
  private static initialized: boolean;
  private static backlog: Array<ILogEntry> = Array<ILogEntry>();
  private static lastRetry: Date | null = null;
  static Initialize(firestore: Firestore, logToFirestore: boolean) {
    if (LoggingService.initialized) {
      console.debug('WARNING: LoggingService.Initialize() called twice');
    }
    this.info('LoggingService.Initialize');
    LoggingService.firestore = firestore;
    LoggingService.logToFirestore = logToFirestore;
    LoggingService.initialized = true;
  }
  private static logToFirestore: boolean;
  private static firestore: Firestore | null = null;

  private static makeLogEntry(level: LogLevel, ...args: any[]): ILogEntry {
    const argsArray = Array<object>();
    for (const arg of args) {
      const argObject: object = arg;
      argsArray.push(argObject);
    }
    const log: ILogEntry = {
      id: uuidv4(),
      level: level,
      localTime: new Date(),
      time: serverTimestamp() as Timestamp,
      args: argsArray,
    };
    return log;
  }

  private static firestoreLog(level: LogLevel, ...args: any[]): void {
    const log: ILogEntry = this.makeLogEntry(level, ...args);
    LoggingService.backlog.push(log);
    try {
      Promise.all([
        async () => {
          await LoggingService.pushBacklog();
        },
      ]);
    } catch (e) {}
  }

  private static async pushLog(entry: ILogEntry): Promise<void> {
    if (!LoggingService.initialized || LoggingService.firestore === null) {
      return Promise.reject();
    }
    const logRef = doc(LoggingService.firestore, 'logs');
    setDoc(logRef, Object.values(entry));
    return Promise.resolve();
  }

  private static _pushMutex = false;
  private static async pushBacklog(): Promise<void> {
    if (
      !LoggingService.initialized ||
      LoggingService.firestore === null ||
      this._pushMutex
    ) {
      return;
    }
    this._pushMutex = true;
    let stop = false;
    while (LoggingService.backlog.length > 0 && !stop) {
      const entry = LoggingService.backlog.shift() as ILogEntry;
      LoggingService.lastRetry = new Date();
      await LoggingService.pushLog(entry)
        .then(() => {
          //
        })
        .catch(() => {
          // put back on the backlog
          LoggingService.backlog.unshift(entry);
          stop = true;
          setTimeout(async function () {
            console.debug('LoggingService.pushBacklog() retrying in 1s');
            await LoggingService.pushBacklog();
          }, 1000);
        });
    }
    this._pushMutex = false;
    return stop ? Promise.reject() : Promise.resolve();
  }

  private static fromFirestoreLog(entry: Array<object>): ILogEntry {
    return {
      id: entry[0].toString(),
      level: entry[1].toString() as LogLevel,
      localTime: entry[2] as Date,
      time: entry[3] as Timestamp,
      args: entry[4] as Array<object>,
    };
  }

  public static log(...args: any[]): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog(LogLevel.Log, ...args);
    }
    console.log(...args);
  }
  public static error(...args: any[]): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog(LogLevel.Error, ...args);
    }
    console.error(...args);
  }
  public static warn(...args: any[]): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog(LogLevel.Warning, ...args);
    }
    console.warn(...args);
  }
  public static info(...args: any[]): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog(LogLevel.Info, ...args);
    }
    console.info(...args);
  }
  public static debug(...args: any[]): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog(LogLevel.Debug, ...args);
    }
    console.debug(...args);
  }
  public static trace(...args: any[]): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog(LogLevel.Trace, ...args);
    }
    console.trace(...args);
  }
}
