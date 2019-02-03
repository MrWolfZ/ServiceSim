import { registerCommandHandler, registerQueryHandler } from 'src/infrastructure/bus';
import { createDefaultResponseGeneratorTemplatesHandler } from './commands/create-default-response-generator-templates';
import { createResponseGeneratorTemplateConstraints, createResponseGeneratorTemplateHandler } from './commands/create-response-generator-template';
import { deleteResponseGeneratorTemplateConstraints, deleteResponseGeneratorTemplateHandler } from './commands/delete-response-generator-template';
import { updateResponseGeneratorTemplateConstraints, updateResponseGeneratorTemplateHandler } from './commands/update-response-generator-template';
import { getAllResponseGeneratorTemplatesHandler } from './queries/get-all-response-generator-templates';
import { getResponseGeneratorTemplatesByIdsAndVersionsHandler } from './queries/get-response-generator-templates-by-ids-and-versions';

export function registerResponseGeneratorTemplateHandlers() {
  const unsubs = [
    registerCommandHandler('create-default-response-generator-templates', createDefaultResponseGeneratorTemplatesHandler),
    registerCommandHandler('create-response-generator-template', createResponseGeneratorTemplateHandler, createResponseGeneratorTemplateConstraints),
    registerCommandHandler('delete-response-generator-template', deleteResponseGeneratorTemplateHandler, deleteResponseGeneratorTemplateConstraints),
    registerCommandHandler('update-response-generator-template', updateResponseGeneratorTemplateHandler, updateResponseGeneratorTemplateConstraints),

    registerQueryHandler('get-all-response-generator-templates', getAllResponseGeneratorTemplatesHandler),
    registerQueryHandler('get-response-generator-templates-by-ids-and-versions', getResponseGeneratorTemplatesByIdsAndVersionsHandler),
  ];

  return () => unsubs.forEach(unsub => unsub());
}
