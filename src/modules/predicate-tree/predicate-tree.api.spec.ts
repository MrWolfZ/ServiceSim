import { EventLog } from '../../api-infrastructure';
import { PredicateTemplateCreatedOrUpdated } from '../predicate-template/predicate-template-created-or-updated';
import { PredicateNodeCreated } from './predicate-node-created';
import { PredicateTree } from './predicate-tree.api';

describe('all predicates projection', () => {
  it('should start and unsubscribe', async () => {
    const sub = PredicateTree.start();
    sub.unsubscribe();
  });

  it('should track all created predicates', async () => {
    const sub = PredicateTree.start();

    await EventLog.publishAsync(PredicateTemplateCreatedOrUpdated.create({
      templateId: 'url-pattern',
      name: 'url-patter',
      description: '',
      evalFunctionBody: 'return true;',
      parameters: [],
    }));

    const matcherId1 = 'predicate/1';
    await EventLog.publishAsync(PredicateNodeCreated.create({
      nodeId: matcherId1,
      name: 'Test',
      description: '',
      templateInfoOrCustomProperties: {
        templateSnapshot: {
          templateId: 'url-pattern',
          version: 1,
          name: 'Test',
          description: 'Description',
          evalFunctionBody: 'return true;',
          parameters: [],
        },
        parameterValues: {},
      },
      parentNodeId: undefined,
    }));

    expect((await PredicateTree.getTopLevelNodes()).length).toBe(1);

    const matcherId2 = 'predicate/2';
    await EventLog.publishAsync(PredicateNodeCreated.create({
      nodeId: matcherId2,
      name: 'Test',
      description: '',
      templateInfoOrCustomProperties: {
        templateSnapshot: {
          templateId: 'url-pattern',
          version: 1,
          name: 'Test',
          description: 'Description',
          evalFunctionBody: 'return true;',
          parameters: [],
        },
        parameterValues: {},
      },
      parentNodeId: undefined,
    }));

    expect((await PredicateTree.getTopLevelNodes()).length).toBe(2);
    sub.unsubscribe();
  });
});
