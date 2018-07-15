import * as pkc from '../../domain/predicate-kind/predicate-kind-created';
import * as pc from '../../domain/predicate/predicate-created';
import { publishAsync } from '../../infrastructure/event-log/event-log';
import { getAllAsync, start } from './all-predicates';

describe('all predicates projection', () => {
  it('should start and unsubscribe', async () => {
    const sub = start();
    sub.unsubscribe();
  });

  it('should track all created predicates', async () => {
    const sub = start();
    await publishAsync(pkc.create({ predicateKindId: 'url-pattern', name: 'url-patter', description: '', evalFunctionBody: 'return true;' }));
    const matcherId1 = 'predicate/1';
    await publishAsync(pc.create({ predicateId: matcherId1, predicateKindId: 'url-pattern', properties: {} }));
    expect((await getAllAsync()).length).toBe(1);
    const matcherId2 = 'predicate/2';
    await publishAsync(pc.create({ predicateId: matcherId2, predicateKindId: 'url-pattern', properties: {} }));
    expect((await getAllAsync()).length).toBe(2);
    sub.unsubscribe();
  });
});
