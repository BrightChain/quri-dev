import { FirebaseOptions } from 'firebase/app';

export enum ConfigurationSource {
  Environment,
  FirebaseHosting,
  FirebaseHostingApp,
}
export interface IEnvironment {
  production: boolean;
  configurationSource: ConfigurationSource;
  firebaseConfig: FirebaseOptions;
}

/* replace with your own values if required, while these are not sensitive accoreding to firebase,
 * should not be committed unless your implementation requires it.
 * If you are using firebase hosting, it will be retrieved for you.
 */

export const environment: IEnvironment = {
  production: true,
  configurationSource: ConfigurationSource.Environment,
  firebaseConfig: {
    apiKey: '',
    appId: '',
    authDomain: '',
    databaseURL: '',
    messagingSenderId: '',
    measurementId: '',
    projectId: '',
    storageBucket: '',
  },
};
