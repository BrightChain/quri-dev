import { Firestore } from '@angular/fire/firestore';
import { uuidv4 } from '@firebase/util';
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { ILogEntry } from '../../environments/interfaces.environment';

export class LoggingService {
  private static initialized: boolean;
  private static backlog: Array<ILogEntry> = Array<ILogEntry>();
  private static lastRetry: Date | null = null;
  static Initialize(firestore: Firestore, logToFirestore: boolean) {
    if (LoggingService.initialized) {
      console.debug('WARNING: LoggingService.Initialize() called twice');
    }
    this.firestoreLog('info', 'LoggingService.Initialize', {
      production: logToFirestore,
    });
    LoggingService.firestore = firestore;
    LoggingService.logToFirestore = logToFirestore;
    LoggingService.initialized = true;
  }
  private static logToFirestore: boolean;
  private static firestore: Firestore | null = null;

  private static firestoreLog(level, ...args): void {
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
    LoggingService.backlog.push(log);
    Promise.all([
      async () => {
        await LoggingService.pushBacklog();
      },
    ]);
  }

  private static async pushLog(entry: ILogEntry): Promise<void> {
    if (!LoggingService.initialized || LoggingService.firestore === null) {
      return Promise.reject();
    }
    const logRef = doc(LoggingService.firestore, 'logs');
    setDoc(logRef, Object.values(entry));
    return Promise.resolve();
  }

  private static async pushBacklog(): Promise<void> {
    if (!LoggingService.initialized || LoggingService.firestore === null) {
      return;
    }
    LoggingService.lastRetry = new Date();
    let stop = false;
    while (LoggingService.backlog.length > 0 && !stop) {
      const entry = LoggingService.backlog.shift() as ILogEntry;
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
    return stop ? Promise.reject() : Promise.resolve();
  }

  private static fromFirestoreLog(entry: Array<object>): ILogEntry {
    return {
      id: entry[0].toString(),
      level: entry[1].toString(),
      localTime: entry[2] as Date,
      time: entry[3] as Timestamp,
      args: entry[4] as Array<object>,
    };
  }

  public static log(...args): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog('log', ...args);
    }
    console.log(...args);
  }
  public static error(...args): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog('error', ...args);
    }
    console.error(...args);
  }
  public static warn(...args): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog('warn', ...args);
    }
    console.warn(...args);
  }
  public static info(...args): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog('info', ...args);
    }
    console.info(...args);
  }
  public static debug(...args): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog('debug', ...args);
    }
    console.debug(...args);
  }
  public static trace(...args): void {
    if (LoggingService.logToFirestore) {
      LoggingService.firestoreLog('trace', ...args);
    }
    console.trace(...args);
  }
}
