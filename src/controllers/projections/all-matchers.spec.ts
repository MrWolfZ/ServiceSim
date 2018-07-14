import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as rmc from '../../domain/request-matcher/request-matcher-created';
import { publishAsync } from '../../infrastructure/event-log/event-log';
import { getAllAsync, start } from './all-matchers';

describe('all request matchers projection', () => {
  it('should start and unsubscribe', async () => {
    const sub = start();
    sub.unsubscribe();
  });

  it('should track all created request matchers', async () => {
    const sub = start();
    const matcherId1 = 'matchers/1';
    await publishAsync(rmc.create({ id: matcherId1, matcherKind: 'url-pattern', properties: {} }));
    await of(1).pipe(delay(100));
    expect((await getAllAsync()).length).toBe(1);
    expect((await getAllAsync()).map(v => v.id)).toContain(matcherId1);
    const matcherId2 = 'matchers/2';
    await publishAsync(rmc.create({ id: matcherId2, matcherKind: 'url-pattern', properties: {} }));
    expect((await getAllAsync()).map(v => v.id)).toContain(matcherId2);
    sub.unsubscribe();
  });
});
