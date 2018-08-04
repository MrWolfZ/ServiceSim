import { PredicateNodeCreated, PredicateTemplateCreatedOrUpdated } from '../domain';
import { EventLog } from '../infrastructure';
import { PredicateTree } from './predicate-tree';

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
      predicateTemplateVersionSnapshot: {
        templateId: 'url-pattern',
        version: 1,
        name: 'Test',
        description: 'Description',
        evalFunctionBody: 'return true;',
        parameters: [],
      },
      name: 'Test',
      parameterValues: {},
      parentNodeId: undefined,
    }));
    expect((await PredicateTree.getTopLevelNodes()).length).toBe(1);
    const matcherId2 = 'predicate/2';
    await EventLog.publishAsync(PredicateNodeCreated.create({
      nodeId: matcherId2,
      predicateTemplateVersionSnapshot: {
        templateId: 'url-pattern',
        version: 1,
        name: 'Test',
        description: 'Description',
        evalFunctionBody: 'return true;',
        parameters: [],
      },
      name: 'Test',
      parameterValues: {},
      parentNodeId: undefined,
    }));
    expect((await PredicateTree.getTopLevelNodes()).length).toBe(2);
    sub.unsubscribe();
  });
});
