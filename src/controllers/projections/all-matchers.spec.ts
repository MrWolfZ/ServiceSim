import * as rmc from '../../domain/request-matcher/request-matcher-created';
import { publishAsync } from '../../infrastructure/event-log/event-log';
import { getAllAsync, startAsync } from './all-matchers';

describe('all request matchers projection', () => {
  it('should start and unsubscribe', async () => {
    const unsub = await startAsync();
    unsub();
  });

  it('should track all created request matchers', async () => {
    const unsub = await startAsync();
    const matcherId1 = 'matchers/1';
    await publishAsync(rmc.create(matcherId1, 'url-pattern', {}));
    expect((await getAllAsync()).length).toBe(1);
    expect((await getAllAsync()).map(v => v.id)).toContain(matcherId1);
    const matcherId2 = 'matchers/2';
    await publishAsync(rmc.create(matcherId2, 'url-pattern', {}));
    expect((await getAllAsync()).map(v => v.id)).toContain(matcherId2);
    unsub();
  });
});
