import { EngineConfigurationAggregate } from 'src/domain/engine-configuration';
import { Aggregate } from 'src/domain/infrastructure/ddd';
import { createCreateDataEvent } from 'src/domain/infrastructure/events';
import { publish } from 'src/infrastructure/bus';
import { getActiveEngineConfigurationPersistenceStrategy } from './engine-configuration-persistence-strategy';

export function persistNewEngineConfigurationAggregate<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(
  aggregateType: TAggregate['@type'],
) {
  return async <TData extends Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>>(
    data: TData & Exact<Omit<TAggregate, keyof Aggregate<TAggregate['@type']>>, TData>,
  ): Promise<TAggregate> => {
    const persistenceStrategy = getActiveEngineConfigurationPersistenceStrategy();
    const id = await persistenceStrategy.generateId(aggregateType);

    const aggregateData: Aggregate<TAggregate['@type']> = {
      id,
      '@type': aggregateType,
    };

    const newAggregate: TAggregate = {
      ...aggregateData,
      ...data as any,
    };

    await persistenceStrategy.upsertAggregate(newAggregate);

    await publish(createCreateDataEvent(newAggregate));

    return newAggregate;
  };
}
