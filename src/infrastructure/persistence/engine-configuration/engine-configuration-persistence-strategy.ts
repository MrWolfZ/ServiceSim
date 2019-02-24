import { EngineConfigurationAggregate } from 'src/domain/engine-configuration';
import { failure } from 'src/util/result-monad';

export interface EngineConfigurationPersistenceStrategy {
  generateId<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type']): Promise<string>;

  // initialize?: () => Promise<void>;
  upsertAggregate<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(aggregate: TAggregate): Promise<void>;
  deleteAggregate<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type'], id: string): Promise<void>;
  // dropAll(): Promise<void>;

  // getAll(): Promise<TDocument[]>;

  getAggregateById<TAggregate extends EngineConfigurationAggregate<TAggregate['@type']>>(
    aggregateType: TAggregate['@type'],
    id: string,
  ): Promise<TAggregate | undefined>;

  // getByIdAndVersion(id: string, version: number): Promise<TDocument | undefined>;
}

let activeStrategy: EngineConfigurationPersistenceStrategy | undefined;

export function getActiveEngineConfigurationPersistenceStrategy() {
  if (!activeStrategy) {
    throw failure(`DB adapter must be set`);
  }

  return activeStrategy;
}

export function setActiveEngineConfigurationPersistenceStrategy(strategy: EngineConfigurationPersistenceStrategy) {
  activeStrategy = strategy;
}
