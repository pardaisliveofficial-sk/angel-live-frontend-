# Angel Live Firebase Native Google Auth Integration

This update pack is for `pardaisliveofficial-sk/angel-live-frontend-`.

## Files
- `google-services.json` — Firebase Android configuration for package `com.angellive.app`.
- `src/runtime-bridge.ts` — keeps AppDeploy auth for web and uses the native Android Google/Firebase bridge in APK builds.
- `.github/workflows/android-apk.yml` — clean Capacitor 6 build, Firebase setup, native Google Sign-In bridge, and APK artifact.

Replace the repository `src/runtime-bridge.ts` and workflow with these files, and keep `google-services.json` at repository root. The workflow copies it into `android/app/` during the build.
