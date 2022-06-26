# Developers
- be wary of / do not commit changes to:
  - environments/environment.ts : do not commit section with firebase config
  - src/firebaseAppCheckConfig.ts : note this file has a firebaseAppCheckConfig.ts.t template
  - firebase.json : note this file has a firebase.json.t template
  - .firebaserc : note this file has a _firebsaserc.t template

## Pre-requisites
- NodeJs installed
  - ```$ npm install -g angular-cli```
- Firebase CLI installed
  - ```$ npm install -g firebase-cli```

## Build
```
$ git clone https://github.com/BrightChain/quri.git
$ cd quri
$ ./buildConfigs.sh # be prepared to enter quri-development as projectId & appcheck site id
$ npm install
$ npm run lint
$ npm run build:development
```

## Run Tests
```
$ npm run test
```

## Serve Locally
```
$ npm run start # or firebase serve
# open browser as directed
```
