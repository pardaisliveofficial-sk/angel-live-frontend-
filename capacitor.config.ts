import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.angel.live',
  appName: 'Angel Live',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true
  }
};

export default config;
