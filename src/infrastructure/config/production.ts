import { AppConfig } from './app-config';

export const PRODUCTION_CONFIG: Partial<AppConfig> = {
  // shared
  environment: 'production',

  // backend
  hostnameToBind: '0.0.0.0',
  sessionSecret: process.env.SESSION_SECRET,

  eventPersistence: {
    adapter: 'Null',
    adapterConfig: {},
  },

  // UI
  uiApiBaseUrl: '/ui-api',
};
