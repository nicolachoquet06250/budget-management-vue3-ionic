## DETERMINATION DE LA VERSION DE L'APPLICATION
$PACKAGE_VERSION=(Get-Content package.json) -join "`n" | ConvertFrom-Json | Select-Object -ExpandProperty "version";
$PACKAGE_VERSION=$PACKAGE_VERSION.replace('.', '-');

# Write-Output $PACKAGE_VERSION;
## DEFINITION DES VARIABLES DE CHEMINS ET MESSAGES
$DEST_FILE="apks/budget-management-$PACKAGE_VERSION.apk";
$COMMIT_MESSAGE="Version $PACKAGE_VERSION de l'application budget-management";

# Write-Output $DEST_FILE;
## LANCEMENT DES COMMANDES CONCERNANT LE SYSTEME DE FICHIERS
Copy-Item "android/app/release/app-release.apk" $DEST_FILE;
Set-Location .\apks;

# Get-ChildItem;
# Set-Location ..\;
## LANCEMENT DES COMMANDES CONCERNANT GIT
git status;
git commit -am $COMMIT_MESSAGE;
git push;

# Write-Output $COMMIT_MESSAGE;
## RETOUR AU BERCAILLE
Set-Location ..\;
