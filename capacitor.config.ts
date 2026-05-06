import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartlab.app',
  appName: 'SMaRT-Lab',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    cleartext: true
  }
};

export default config;
