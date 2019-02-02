import { registerCommandHandler, registerQueryHandler } from 'src/infrastructure/bus';
import { createDefaultPredicateTemplatesHandler } from './commands/create-default-predicate-templates';
import { createPredicateTemplateConstraints, createPredicateTemplateHandler } from './commands/create-predicate-template';
import { deletePredicateTemplate, deletePredicateTemplateConstraints } from './commands/delete-predicate-template';
import { dropAllPredicateTemplates } from './commands/drop-all-predicate-templates';
import { updatePredicateTemplate, updatePredicateTemplateConstraints } from './commands/update-predicate-template';
import { getAllPredicateTemplatesHandler } from './queries/get-all-predicate-templates';
import { getPredicateTemplatesByIdsAndVersionsHandler } from './queries/get-predicate-templates-by-ids-and-versions';

export function registerPredicateTemplateHandlers() {
  registerCommandHandler('create-default-predicate-templates', createDefaultPredicateTemplatesHandler);
  registerCommandHandler('create-predicate-template', createPredicateTemplateHandler, createPredicateTemplateConstraints);
  registerCommandHandler('delete-predicate-template', deletePredicateTemplate, deletePredicateTemplateConstraints);
  registerCommandHandler('update-predicate-template', updatePredicateTemplate, updatePredicateTemplateConstraints);
  registerCommandHandler('drop-all-predicate-templates', dropAllPredicateTemplates);

  registerQueryHandler('get-all-predicate-templates', getAllPredicateTemplatesHandler);
  registerQueryHandler('get-predicate-templates-by-ids-and-versions', getPredicateTemplatesByIdsAndVersionsHandler);
}
