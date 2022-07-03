/// <reference types="node" />
'use strict';
import { FirebaseOptions } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import { ConfigurationSource } from '../enumerations/configurationSource';

export interface IEnvironment {
  production: boolean;
  configurationSource: ConfigurationSource;
  firebase: FirebaseOptions;
}

export interface ILogEntry {
  id: string;
  level: string;
  time: Timestamp;
  args: Array<object>;
}
