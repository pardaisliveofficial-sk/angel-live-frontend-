# Angel Live Android

This Android build is a native shell for the live Angel Live web application.

Production URL: https://app.angellive.soulverseapps.com/

The native shell uses an Android Custom Tab for authentication and the web app so Google/AppDeploy authentication runs in a normal browser context instead of an embedded WebView popup. This avoids the Android WebView popup/opener failure.

The GitHub Actions workflow builds a debug APK and uploads it as an artifact.
