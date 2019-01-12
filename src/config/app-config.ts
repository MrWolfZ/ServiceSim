export interface AppConfig {
  // shared
  environment: 'development' | 'production';

  // backend
  hostnameToBind: string;
  port: number;
  sessionSecret: string;
  persistenceAdapter: 'InMemory' | 'FileSystem';

  // UI
  uiApiBaseUrl: string;
}
