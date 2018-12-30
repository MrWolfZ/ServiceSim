import { EventLog } from '../../api-infrastructure';
import { PredicateTemplateCreated } from '../predicate-template/predicate-template.events';
import { PredicateNodeCreated } from '../predicate-tree/predicate-node.events';
import { PredicateTree } from './predicate-tree.api';

describe('all predicates projection', () => {
  it('should start and unsubscribe', async () => {
    const sub = PredicateTree.start();
    sub.unsubscribe();
  });

  it('should track all created predicates', async () => {
    const sub = PredicateTree.start();

    await EventLog.publishAsync(PredicateTemplateCreated.create({
      templateId: 'url-pattern',
      data: {
        name: 'url-patter',
        description: '',
        evalFunctionBody: 'return true;',
        parameters: [],
      },
    }));

    const matcherId1 = 'predicate/1';
    await EventLog.publishAsync(PredicateNodeCreated.create({
      nodeId: matcherId1,
      data: {
        name: 'Test',
        description: '',
        templateInfoOrEvalFunctionBody: {
          templateId: 'url-pattern',
          templateVersion: 1,
          templateDataSnapshot: {
            name: 'Test',
            description: 'Description',
            evalFunctionBody: 'return true;',
            parameters: [],
          },
          parameterValues: {},
        },
        childNodeIdsOrResponseGenerator: undefined,
      },
    }));

    expect((await PredicateTree.getTopLevelNodes()).length).toBe(1);

    const matcherId2 = 'predicate/2';
    await EventLog.publishAsync(PredicateNodeCreated.create({
      nodeId: matcherId2,
      data: {
        name: 'Test',
        description: '',
        templateInfoOrEvalFunctionBody: {
          templateId: 'url-pattern',
          templateVersion: 1,
          templateDataSnapshot: {
            name: 'Test',
            description: 'Description',
            evalFunctionBody: 'return true;',
            parameters: [],
          },
          parameterValues: {},
        },
        childNodeIdsOrResponseGenerator: undefined,
      },
    }));

    expect((await PredicateTree.getTopLevelNodes()).length).toBe(2);
    sub.unsubscribe();
  });
});
