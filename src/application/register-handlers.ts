import { registerAdminHandlers } from './admin/register-handlers';
import { registerPredicateTemplateHandlers } from './predicate-template/register-handlers';
import { registerResponseGeneratorTemplateHandlers } from './response-generator-template/register-handlers';

export function registerHandlers() {
  registerAdminHandlers();
  registerPredicateTemplateHandlers();
  registerResponseGeneratorTemplateHandlers();
}
