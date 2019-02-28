import { EngineConfigurationAggregate } from 'src/domain/engine-configuration';
import { failure } from 'src/util/result-monad';

export interface EngineConfigurationPersistenceStrategy {
  generateId<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type']): Promise<string>;

  upsertAggregate<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(aggregate: TAggregate): Promise<void>;
  deleteAggregate<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type'], id: string): Promise<void>;
  deleteAllData(): Promise<void>;

  getAllAggregates<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type']): Promise<TAggregate[]>;

  getAggregateById<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(
    aggregateType: TAggregate['@type'],
    id: string,
  ): Promise<TAggregate | undefined>;

  // getByIdAndVersion(id: string, version: number): Promise<TDocument | undefined>;
}

let activeStrategy: EngineConfigurationPersistenceStrategy | undefined;

export function getActiveEngineConfigurationPersistenceStrategy() {
  if (!activeStrategy) {
    throw failure(`engine configuration persistence strategy is not set`);
  }

  return activeStrategy;
}

export function setActiveEngineConfigurationPersistenceStrategy(strategy: EngineConfigurationPersistenceStrategy) {
  activeStrategy = strategy;
}
