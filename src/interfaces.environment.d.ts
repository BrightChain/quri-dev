import { FirebaseOptions } from 'firebase/app';

export enum ConfigurationSource {
  Environment,
  FirebaseHosting,
  FirebaseHostingApp,
}

export interface IEnvironment {
  production: boolean;
  configurationSource: ConfigurationSource;
  firebase: FirebaseOptions;
}
