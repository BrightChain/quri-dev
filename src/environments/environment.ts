// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
