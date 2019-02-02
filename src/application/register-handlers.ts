import { registerAdminHandlers } from './admin/register-handlers';
import { registerPredicateTemplateHandlers } from './predicate-template/register-handlers';
import { registerPredicateTreeHandlers } from './predicate-tree/register-handlers';
import { registerResponseGeneratorTemplateHandlers } from './response-generator-template/register-handlers';
import { registerServiceInvocationHandlers } from './service-invocation/register-handlers';
import { registerSimulationHandlers } from './simulation/register-handlers';

export function registerHandlers() {
  registerAdminHandlers();
  registerPredicateTemplateHandlers();
  registerResponseGeneratorTemplateHandlers();
  registerPredicateTreeHandlers();
  registerServiceInvocationHandlers();
  registerSimulationHandlers();
}
