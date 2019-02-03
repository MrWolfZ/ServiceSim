export interface AppConfig {
  // shared
  environment: 'development' | 'production';
  platform: 'node' | 'browser';

  // backend
  hostnameToBind: string;
  port: number;
  sessionSecret: string;

  persistence: {
    adapter: 'InMemory' | 'FileSystem';
    adapterConfig: any;
  };

  eventPersistence: {
    adapter: 'Null' | 'InMemory' | 'FileSystem';
    adapterConfig: any;
  };

  // UI
  uiApiBaseUrl: string;
}