import { AppConfig } from './app-config';
import { DEFAULT_CONFIG } from './default';
import { PRODUCTION_CONFIG } from './production';

let envConfig: Partial<AppConfig> = {};

if (['production'].includes(process.env.NODE_ENV!)) {
  envConfig = PRODUCTION_CONFIG;
}

export const CONFIG: AppConfig = {
  ...DEFAULT_CONFIG,
  ...envConfig,
};
