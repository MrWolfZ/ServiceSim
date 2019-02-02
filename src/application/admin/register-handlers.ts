import { registerCommandHandler } from 'src/infrastructure/bus';
import { resetToDefaultDataHandler } from './commands/reset-to-default-data';

export function registerAdminHandlers() {
  registerCommandHandler('reset-to-default-data', resetToDefaultDataHandler);
}
