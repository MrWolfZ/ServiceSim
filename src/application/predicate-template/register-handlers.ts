import { registerCommandHandler, registerQueryHandler } from 'src/infrastructure/bus';
import { createDefaultPredicateTemplatesHandler } from './commands/create-default-predicate-templates';
import { createPredicateTemplateConstraints, createPredicateTemplateHandler } from './commands/create-predicate-template';
import { deletePredicateTemplateConstraints, deletePredicateTemplateHandler } from './commands/delete-predicate-template';
import { updatePredicateTemplateConstraints, updatePredicateTemplateHandler } from './commands/update-predicate-template';
import { getAllPredicateTemplatesHandler } from './queries/get-all-predicate-templates';
import { getPredicateTemplatesByIdsAndVersionsHandler } from './queries/get-predicate-templates-by-ids-and-versions';

export function registerPredicateTemplateHandlers() {
  const unsubs = [
    registerCommandHandler('create-default-predicate-templates', createDefaultPredicateTemplatesHandler),
    registerCommandHandler('create-predicate-template', createPredicateTemplateHandler, createPredicateTemplateConstraints),
    registerCommandHandler('delete-predicate-template', deletePredicateTemplateHandler, deletePredicateTemplateConstraints),
    registerCommandHandler('update-predicate-template', updatePredicateTemplateHandler, updatePredicateTemplateConstraints),

    registerQueryHandler('get-all-predicate-templates', getAllPredicateTemplatesHandler),
    registerQueryHandler('get-predicate-templates-by-ids-and-versions', getPredicateTemplatesByIdsAndVersionsHandler),
  ];

  return () => unsubs.forEach(unsub => unsub());
}
