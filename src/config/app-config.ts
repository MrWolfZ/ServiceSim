export interface AppConfig {
  // shared
  environment: 'development' | 'production';

  // backend
  hostnameToBind: string;
  port: number;
  sessionSecret: string;

  persistence: {
    adapter: 'InMemory' | 'FileSystem';
    adapterConfig: any;
  };

  eventPersistence: {
    adapter: 'InMemory' | 'FileSystem';
    adapterConfig: any;
  };

  // UI
  uiApiBaseUrl: string;
}
