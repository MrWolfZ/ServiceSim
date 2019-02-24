import { Aggregate } from 'src/domain/infrastructure/ddd';
import { Diff } from 'src/domain/infrastructure/diff';
import { applyDiff } from 'src/util/diff';
import { failure } from 'src/util/result-monad';
import { isEmpty } from 'src/util/util';
import { getActiveEngineConfigurationPersistenceStrategy } from './engine-configuration-persistence-strategy';

// TODO: handle concurrent updates
export async function patchPersistedEngineConfigurationAggregate<TAggregate extends Aggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  id: string,
  diff: Diff<TAggregate>,
): Promise<void> {
  const persistenceStrategy = getActiveEngineConfigurationPersistenceStrategy();

  const aggregate = await persistenceStrategy.getAggregateById(aggregateType, id);

  if (!aggregate) {
    throw failure(`patch failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
  }

  if (isEmpty(diff)) {
    return;
  }

  const updatedAggregate = applyDiff(aggregate, diff);

  await persistenceStrategy.upsert(updatedAggregate);
}
