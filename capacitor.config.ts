import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.angel.live',
  appName: 'Angel Live',
  webDir: 'dist',
  server: {
    url: 'https://app.angellive.soulverseapps.com/',
    cleartext: false,
    androidScheme: 'https'
  }
};
export default config;
