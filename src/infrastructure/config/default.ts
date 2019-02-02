import { AppConfig } from './app-config';

const port = process.env.PORT as any || 3000;

export const DEFAULT_CONFIG: AppConfig = {
  // shared
  environment: 'development',
  platform: (() => { try { return !!window; } catch { return false; } })() ? 'browser' : 'node',

  // backend
  hostnameToBind: 'localhost',
  port,
  sessionSecret: 'ashdfjhasdlkjfhalksdjhflak',

  persistence: {
    adapter: 'FileSystem',
    adapterConfig: {
      dataDir: `${process.cwd()}/dist/.data`,
    },
  },

  eventPersistence: {
    adapter: 'Null',
    adapterConfig: {
      dataDir: `${process.cwd()}/dist/.events`,
    },
  },

  // UI
  uiApiBaseUrl: `http://localhost:${port}/ui-api`,
};
