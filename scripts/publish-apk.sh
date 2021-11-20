#!/bin/bash

## DETERMINATION DE LA VERSION DE L'APPLICATION
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g');

## DEFINITION DES VARIABLES DE CHEMINS ET MESSAGES
DIST_FILE="apks/budget-management-${PACKAGE_VERSION/./"-"}.apk";
DIST_FILE=${DIST_FILE/\r/""};

# echo ${DIST_FILE};
## LANCEMENT DES COMMANDES CONCERNANT LE SYSTEME DE FICHIERS
cp "android/app/release/app-release.apk" ${DIST_FILE};
cd ./apks;

## LANCEMENT DES COMMANDES CONCERNANT GIT
git status;
git commit -am "Version $PACKAGE_VERSION de l'application budget-management";
git push;

## RETOUR AU BERCAILLE
cd ../;