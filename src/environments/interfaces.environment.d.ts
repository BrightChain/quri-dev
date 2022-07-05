/// <reference types="node" />
'use strict';
import { FirebaseOptions } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import { ConfigurationSource } from '../enumerations/configurationSource';
import { LogLevel } from '../enumerations/logLevel';

export interface IEnvironment {
  production: boolean;
  configurationSource: ConfigurationSource;
  firebase: FirebaseOptions;
}

export interface ILogEntry {
  id: string;
  level: LogLevel;
  localTime: Date;
  time: Timestamp;
  args: Array<object>;
}
