#!/bin/bash
currentDir=$(pwd)
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
if [[ "${currentDir}" != "${SCRIPT_DIR}" ]]; then
  cd "${SCRIPT_DIR}"
fi

if [[ "$projectId" == "" ]]; then
	echo "Input projectId:"
	read projectId
	echo "Input firebaseAppCheckKey:"
	read firebaseAppCheckKey
fi
echo "Running ${0} for project ${projectId} from ${currentDir}"

git update-index --assume-unchanged src/environments/environment*.ts

echo "Making src/firebaseAppCheckConfig.ts"
#APP_CHECK_CONFIG="export const firebaseAppCheckConfig = {\\n  siteKey: '${firebaseAppCheckKey}',\\n};"
#echo -n -e "${APP_CHECK_CONFIG}" > ./src/firebaseAppCheckConfig.ts
cat src/firebaseAppCheckConfig.ts.t | sed "s/__APP_CHECK_SITE_KEY__/${firebaseAppCheckKey}/" > src/firebaseAppCheckConfig.ts

echo "Making .firebaserc"
cat _firebaserc.t | sed "s/__FIREBASE_SITE__/${projectId}/" > .firebaserc

echo "Making firebase.json"
cat firebase.json.t | sed "s/__FIREBASE_SITE__/${projectId}/" > firebase.json

echo ""
echo "Done."
echo ""
cd "${currentDir}"
