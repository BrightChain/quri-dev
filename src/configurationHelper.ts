import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ConfigurationSource } from './enumerations/configurationSource';
import { IConfigurationPair } from './interfaces';

declare global {
  interface Window {
    quri: AppModule | null;
    firebase?: {
      apps: Array<FirebaseApp>;
    } | null;
  }
}

export class ConfigurationHelper {
  static GetConfigFromRunningApp(): FirebaseOptions {
    if (
      window.firebase !== undefined &&
      window.firebase !== null &&
      window.firebase.apps !== undefined &&
      window.firebase.apps.length > 0 &&
      window.firebase.apps[0] !== undefined &&
      window.firebase.apps[0] !== null
    ) {
      const _firebaseHostingApp: FirebaseApp = window.firebase.apps[0];
      if (_firebaseHostingApp.options !== undefined) {
        return _firebaseHostingApp.options;
      }
    }
    throw new Error('failed to get config from running app');
  }
  static GetConfigFromHosting(): FirebaseOptions {
    const firebaseHostingMagicConfigUrl = '/__/firebase/init.json';
    let result: FirebaseOptions | null = null;
    let caughtError = null;
    Promise.resolve(async () => {
      fetch(firebaseHostingMagicConfigUrl)
        .then(async (response) => {
          const jsonText: string = await response.text();
          result = JSON.parse(jsonText) as FirebaseOptions;
        })
        .catch((error) => {
          caughtError = error;
        });
    });
    if (result === null) {
      const errText =
        'Unable to fetch and parse configuration from Firebase Hosting';
      console.error(errText, caughtError);
      throw new Error(errText);
    }
    return result;
  }
  static EnsureApp(configuration?: FirebaseOptions): FirebaseApp {
    if (
      window.firebase !== undefined &&
      window.firebase !== null &&
      window.firebase.apps !== undefined &&
      window.firebase.apps.length > 0 &&
      window.firebase.apps[0] !== undefined &&
      window.firebase.apps[0] !== null
    ) {
      const _firebaseHostingApp: FirebaseApp = window.firebase.apps[0];
      // if loaded app appears to have configuration we do not (eg from hosting), replace the environment copy
      if (
        environment.firebase.apiKey === undefined ||
        environment.firebase.apiKey == ''
      ) {
        environment.firebase = _firebaseHostingApp.options;
      }
      return _firebaseHostingApp;
    } else if (configuration !== undefined) {
      environment.firebase = configuration;
      return initializeApp(configuration);
    } else {
      throw new Error('failed to configure firebase');
    }
  }
  static ConfigLooksValid(config: FirebaseOptions): boolean {
    return (
      config.apiKey !== undefined &&
      config.apiKey != '' &&
      config.authDomain !== undefined &&
      config.authDomain != '' &&
      config.databaseURL !== undefined &&
      config.databaseURL != '' &&
      config.projectId !== undefined &&
      config.projectId != '' &&
      config.storageBucket !== undefined &&
      config.storageBucket != '' &&
      config.messagingSenderId !== undefined &&
      config.messagingSenderId != ''
    );
  }
  static EnsureConfiguration(): IConfigurationPair {
    console.debug('entering EnsureConfiguration()');
    // start with the config from environment
    let configToUse: FirebaseOptions = environment.firebase;
    let configSource: ConfigurationSource = ConfigurationSource.Environment;
    let method = 0;
    // if the config doesn't look like it is populated, try to get from Firebase hosting
    while (!this.ConfigLooksValid(configToUse)) {
      console.debug(
        'configuration does not look valid, trying next method',
        configSource
      );
      try {
        switch (method) {
          case 0:
            // try running app
            // see if we can get it out of a firebase app instance (hosting init.js)
            configToUse = ConfigurationHelper.GetConfigFromRunningApp();
            configSource = ConfigurationSource.FirebaseHostingApp;
            break;
          case 1:
            // directly try to access hosting init.js config
            configToUse = ConfigurationHelper.GetConfigFromHosting();
            configSource = ConfigurationSource.FirebaseHosting;
            break;
          default:
            throw new Error(
              'Unable to find a firebase configuration that looks valid'
            );
        }
      } catch (error) {
        if (error === undefined) {
          console.debug('auto-config method failed', method);
        } else {
          console.debug(method, error);
        }
      }
      method++;
    }
    if (!this.ConfigLooksValid(configToUse)) {
      throw new Error(
        'Unable to find a firebase configuration that looks valid'
      );
    }
    console.debug('configuration looks valid, using', configSource);
    return { source: configSource, options: configToUse };
  }
}
