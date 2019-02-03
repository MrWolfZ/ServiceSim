import { registerHandlers } from 'src/application/register-handlers';
import { initializeDB } from 'src/infrastructure/db';
import { inMemoryPersistenceAdapter } from 'src/persistence/db/in-memory';
import { processSimulationRequest } from './process-simulation-request';

describe('simulation', () => {
  let unsub = () => { };

  beforeEach(async () => {
    await initializeDB({ adapter: inMemoryPersistenceAdapter });

    unsub = registerHandlers();
  });

  afterEach(() => {
    unsub();
  });

  it('should return 404 if no predicates exist', async () => {
    const { response } = await processSimulationRequest({ request: { path: '/', body: '' }, timeoutInMillis: 100 });
    expect(response.statusCode).toEqual(404);
  });
});
