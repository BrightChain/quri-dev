import { IEnvironment } from '../environments/interfaces.environment';
import { ConfigurationSource } from '../enumerations/configurationSource';

/* replace with your own values if required, while these are not sensitive accoreding to firebase,
 * should not be committed unless your implementation requires it.
 * If you are using firebase hosting, it will be retrieved for you.
 */

export const environment: IEnvironment = {
  production: true,
  configurationSource: ConfigurationSource.Environment,
  firebase: {
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
