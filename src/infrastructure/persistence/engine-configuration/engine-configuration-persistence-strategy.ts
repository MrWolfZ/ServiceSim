import { Aggregate } from 'src/domain/infrastructure/ddd';
import { failure } from 'src/util/result-monad';

export interface EngineConfigurationPersistenceStrategy {
  generateId<TAggregate extends Aggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type']): Promise<string>;

  // initialize?: () => Promise<void>;
  upsert<TAggregate extends Aggregate<TAggregate['@type']>>(aggregate: TAggregate): Promise<void>;
  // delete(document: TDocument): Promise<void>;
  // dropAll(): Promise<void>;

  // getAll(): Promise<TDocument[]>;
  getAggregateById<TAggregate extends Aggregate<TAggregate['@type']>>(aggregateType: TAggregate['@type'], id: string): Promise<TAggregate | undefined>;
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
