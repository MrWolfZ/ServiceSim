// tslint:disable:max-line-length

import { registerCommandHandler, registerQueryHandler } from 'src/infrastructure/bus';
import { addChildPredicateNodeFromTemplateConstraints, addChildPredicateNodeFromTemplateHandler } from './commands/add-child-predicate-node-from-template';
import { addChildPredicateNodeWithCustomFunctionBodyConstraints, addChildPredicateNodeWithCustomFunctionBodyHandler } from './commands/add-child-predicate-node-with-custom-function-body';
import { deletePredicateNodeConstraints, deletePredicateNodeHandler } from './commands/delete-predicate-node';
import { ensureRootPredicateNodeExistsHandler } from './commands/ensure-root-predicate-node-exists';
import { setPredicateNodeResponseGeneratorFromTemplateConstraints, setPredicateNodeResponseGeneratorFromTemplateHandler } from './commands/set-predicate-node-response-generator-from-template';
import { setPredicateNodeResponseGeneratorWithCustomBodyConstraints, setPredicateNodeResponseGeneratorWithCustomBodyHandler } from './commands/set-predicate-node-response-generator-with-custom-body';
import { updatePredicateNodeConstraints, updatePredicateNodeHandler } from './commands/update-predicate-node';
import { getAllPredicateNodesHandler } from './queries/get-all-predicate-nodes';

export function registerPredicateTreeHandlers() {
  const unsubs = [
    registerCommandHandler('add-child-predicate-node-from-template', addChildPredicateNodeFromTemplateHandler, addChildPredicateNodeFromTemplateConstraints),
    registerCommandHandler('add-child-predicate-node-with-custom-function-body', addChildPredicateNodeWithCustomFunctionBodyHandler, addChildPredicateNodeWithCustomFunctionBodyConstraints),
    registerCommandHandler('delete-predicate-node', deletePredicateNodeHandler, deletePredicateNodeConstraints),
    registerCommandHandler('ensure-root-predicate-node-exists', ensureRootPredicateNodeExistsHandler),
    registerCommandHandler('set-response-generator-from-template', setPredicateNodeResponseGeneratorFromTemplateHandler, setPredicateNodeResponseGeneratorFromTemplateConstraints),
    registerCommandHandler('set-response-generator-with-custom-body', setPredicateNodeResponseGeneratorWithCustomBodyHandler, setPredicateNodeResponseGeneratorWithCustomBodyConstraints),
    registerCommandHandler('update-predicate-node', updatePredicateNodeHandler, updatePredicateNodeConstraints),

    registerQueryHandler('get-all-predicate-nodes', getAllPredicateNodesHandler),
  ];

  return () => unsubs.forEach(unsub => unsub());
}
