import { PredicateCreated, PredicateKindCreated } from '../domain';
import { publishAsync } from '../infrastructure/event-log/event-log';
import { getTopLevelPredicateNodes, start } from './predicate-tree';

describe('all predicates projection', () => {
  it('should start and unsubscribe', async () => {
    const sub = start();
    sub.unsubscribe();
  });

  it('should track all created predicates', async () => {
    const sub = start();
    await publishAsync(PredicateKindCreated.create({ predicateKindId: 'url-pattern', name: 'url-patter', description: '', evalFunctionBody: 'return true;' }));
    const matcherId1 = 'predicate/1';
    await publishAsync(PredicateCreated.create({ predicateId: matcherId1, predicateKindId: 'url-pattern', properties: {}, parentPredicateId: undefined }));
    expect((await getTopLevelPredicateNodes()).length).toBe(1);
    const matcherId2 = 'predicate/2';
    await publishAsync(PredicateCreated.create({ predicateId: matcherId2, predicateKindId: 'url-pattern', properties: {}, parentPredicateId: undefined }));
    expect((await getTopLevelPredicateNodes()).length).toBe(2);
    sub.unsubscribe();
  });
});
