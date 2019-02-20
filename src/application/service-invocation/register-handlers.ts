import { registerCommandHandler } from 'src/infrastructure/bus';
import { setServiceInvocationResponseConstraints, setServiceInvocationResponseHandler } from './commands/set-service-invocation-response';

export function registerServiceInvocationHandlers() {
  const unsubs = [
    registerCommandHandler('set-service-invocation-response', setServiceInvocationResponseHandler, setServiceInvocationResponseConstraints),
  ];

  return () => unsubs.forEach(unsub => unsub());
}
