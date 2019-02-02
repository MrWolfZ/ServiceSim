import { registerCommandHandler, registerQueryHandler } from 'src/infrastructure/bus';
import { processSimulationRequestHandler } from './commands/process-simulation-request';
import { getPredicateTreeHandler } from './queries/get-predicate-tree';

export function registerSimulationHandlers() {
  registerCommandHandler('process-simulation-request', processSimulationRequestHandler);

  registerQueryHandler('get-predicate-tree', getPredicateTreeHandler);
}
