import { AppConfig } from './app-config';

export const PRODUCTION_CONFIG: Partial<AppConfig> = {
  // shared
  environment: 'production',

  // backend
  hostnameToBind: '0.0.0.0',
  sessionSecret: process.env.SESSION_SECRET,

  // UI
  uiApiBaseUrl: '/ui-api',
};
