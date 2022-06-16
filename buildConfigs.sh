#!/bin/bash
currentDir=$(pwd)
echo "Running ${0} for project ${projectId} from ${currentDir}"

echo "Making src/firebaseConfig.ts"
FIREBASE_CONFIG="export const firebaseConfig = ${firebaseConfig};"
echo -n -e "${FIREBASE_CONFIG}" > ./src/firebaseConfig.ts

echo "Making src/firebaseAppCheckConfig.ts"
APP_CHECK_CONFIG="export const firebaseAppCheckConfig = {\\n  siteKey: '${firebaseAppCheckKey}',\\n};"
echo -n -e "${APP_CHECK_CONFIG}" > ./src/firebaseAppCheckConfig.ts

echo "Making .firebaserc"
cat _firebaserc.t | sed "s/__FIREBASE_SITE__/${projectId}/" > .firebaserc

echo "Making firebase.json"
cat firebase.json.t | sed "s/__FIREBASE_SITE__/${projectId}/" > firebase.json



echo ""
echo "Done."
echo ""