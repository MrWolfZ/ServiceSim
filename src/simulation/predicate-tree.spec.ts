import { PredicateCreated, PredicateKindCreatedOrUpdated } from '../domain';
import { EventLog } from '../infrastructure';
import { PredicateTree } from './predicate-tree';

describe('all predicates projection', () => {
  it('should start and unsubscribe', async () => {
    const sub = PredicateTree.start();
    sub.unsubscribe();
  });

  it('should track all created predicates', async () => {
    const sub = PredicateTree.start();
    await EventLog.publishAsync(PredicateKindCreatedOrUpdated.create({
      predicateKindId: 'url-pattern',
      name: 'url-patter',
      description: '',
      evalFunctionBody: 'return true;',
      parameters: [],
    }));
    const matcherId1 = 'predicate/1';
    await EventLog.publishAsync(PredicateCreated.create({
      predicateId: matcherId1,
      predicateKindId: 'url-pattern',
      parameters: {},
      parentPredicateId: undefined,
    }));
    expect((await PredicateTree.getTopLevelNodes()).length).toBe(1);
    const matcherId2 = 'predicate/2';
    await EventLog.publishAsync(PredicateCreated.create({
      predicateId: matcherId2,
      predicateKindId: 'url-pattern',
      parameters: {},
      parentPredicateId: undefined,
    }));
    expect((await PredicateTree.getTopLevelNodes()).length).toBe(2);
    sub.unsubscribe();
  });
});
