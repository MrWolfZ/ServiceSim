import { EngineConfigurationAggregate } from 'src/domain/engine-configuration';
import { getActiveEngineConfigurationPersistenceStrategy } from './engine-configuration-persistence-strategy';

export async function getAllPersistedEngineConfigurationAggregates<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
): Promise<TAggregate[]> {
  const persistenceStrategy = getActiveEngineConfigurationPersistenceStrategy();
  return await persistenceStrategy.getAllAggregates(aggregateType);
}
