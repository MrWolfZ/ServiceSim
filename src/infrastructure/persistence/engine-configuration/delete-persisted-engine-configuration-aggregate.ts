import { EngineConfigurationAggregate } from 'src/domain/engine-configuration';
import { failure } from 'src/util/result-monad';
import { getActiveEngineConfigurationPersistenceStrategy } from './engine-configuration-persistence-strategy';

export async function deletePersistedEngineConfigurationAggregate<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
  id: string,
): Promise<void> {
  const persistenceStrategy = getActiveEngineConfigurationPersistenceStrategy();

  const aggregate = await persistenceStrategy.getAggregateById(aggregateType, id);

  if (!aggregate) {
    throw failure(`delete failed: aggregate with id ${id} of type ${aggregateType} does not exist`);
  }

  await persistenceStrategy.deleteAggregate(aggregateType, id);
}
