import { registerCommandHandler } from 'src/infrastructure/bus';
import { createServiceInvocationConstraints, createServiceInvocationHandler } from './commands/create-service-invocation';
import { setServiceInvocationResponseConstraints, setServiceInvocationResponseHandler } from './commands/set-service-invocation-response';

export function registerServiceInvocationHandlers() {
  registerCommandHandler('create-service-invocation', createServiceInvocationHandler, createServiceInvocationConstraints);
  registerCommandHandler('set-service-invocation-response', setServiceInvocationResponseHandler, setServiceInvocationResponseConstraints);
}
