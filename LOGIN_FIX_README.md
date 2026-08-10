# Angel Live Android login fix

This build does NOT rely on an external browser/deep-link callback for the AppDeploy
authentication popup. The Android WebView is configured to support `window.open()` /
multiple windows and keeps the AppDeploy OAuth popup inside the app WebView, preserving
the opener relationship needed by the web auth flow.

The production Angel Live URL remains:
https://app.angellive.soulverseapps.com/

Build through GitHub Actions and test Google/Email sign-in.
