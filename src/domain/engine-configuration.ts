import { Aggregate } from './infrastructure/ddd';

export interface EngineConfigurationAggregate<TAggregateType extends string> extends Aggregate<TAggregateType> {
  name: string;
}
