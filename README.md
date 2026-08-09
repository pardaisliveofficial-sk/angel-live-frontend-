# Angel Live Android

This package wraps the production Angel Live web application:
https://app.angellive.soulverseapps.com/

The GitHub Actions workflow installs Capacitor, creates Android, generates the
Angel Live icon/splash from resources/, syncs, and builds a debug APK.

No TypeScript Capacitor config is used; capacitor.config.json avoids the
previous "Could not find installation of Typescript" failure.
