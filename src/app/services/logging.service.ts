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
  static Initialize(production: boolean) {
    if (LoggingService.initialized) {
      console.debug('WARNING: LoggingService.Initialize() called twice');
    }
    this.firestoreLog('info', 'LoggingService.Initialize', {
      production: production,
    });
    LoggingService.logToFirestore = production;
    LoggingService.initialized = true;
  }
  private static logToFirestore: boolean;
  private static firestore = getFirestore();

  private static firestoreLog(level, ...args): void {
    const argsArray = Array<object>();
    for (const arg of args) {
      const argObject: object = arg;
      argsArray.push(argObject);
    }
    const log: ILogEntry = {
      id: uuidv4(),
      level: level,
      time: serverTimestamp() as Timestamp,
      args: argsArray,
    };
    const logRef = doc(LoggingService.firestore, 'logs');
    setDoc(logRef, Object.values(log));
  }

  private static fromFirestoreLog(entry: Array<object>): ILogEntry {
    return {
      id: entry[0].toString(),
      level: entry[1].toString(),
      time: entry[2] as Timestamp,
      args: entry[3] as Array<object>,
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
