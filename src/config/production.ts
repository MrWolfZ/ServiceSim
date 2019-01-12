import { AppConfig } from './app-config';

export const PRODUCTION_CONFIG: Partial<AppConfig> = {
  // shared
  environment: 'production',

  // backend
  hostnameToBind: '0.0.0.0',
  sessionSecret: process.env.SESSION_SECRET,
  persistence: {
    adapter: 'FileSystem',
    adapterConfig: {
      dataDir: `${process.cwd()}/.data`,
    },
  },

  // UI
  uiApiBaseUrl: '/ui-api',
};
