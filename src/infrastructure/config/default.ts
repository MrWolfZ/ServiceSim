import { AppConfig } from './app-config';

const port = process.env.PORT as any || 3000;

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');

export const DEFAULT_CONFIG: AppConfig = {
  // shared
  environment: 'development',
  platform: isBrowser() ? 'browser' : 'node',

  // backend
  hostnameToBind: 'localhost',
  port,
  sessionSecret: 'ashdfjhasdlkjfhalksdjhflak',

  persistence: {
    adapter: 'FileSystem',
    adapterConfig: {
      dataDir: `${process.cwd()}/.data/db`,
    },
  },

  eventPersistence: {
    adapter: 'FileSystem',
    adapterConfig: {
      dataDir: `${process.cwd()}/.data/events`,
    },
  },

  // UI
  uiApiBaseUrl: `http://localhost:${port}/ui-api`,
};
