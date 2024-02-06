import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rotosol.terminal',
  appName: 'Rotosol PE Terminal',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
