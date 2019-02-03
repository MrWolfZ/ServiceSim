import { registerCommandHandler } from 'src/infrastructure/bus';
import { resetToDefaultDataHandler } from './commands/reset-to-default-data';

export function registerAdminHandlers() {
  const unsubs = [
    registerCommandHandler('reset-to-default-data', resetToDefaultDataHandler),
  ];

  return () => unsubs.forEach(unsub => unsub());
}
