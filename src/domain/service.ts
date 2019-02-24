import { Aggregate } from './infrastructure/ddd';
import { ServiceOperationAggregate } from './service-operation';

export interface ServiceData {
  name: string;
  description: string;
  pathRegex: string;
  operations: ServiceOperationAggregate[];
}

export const SERVICE_AGGREGATE_TYPE = 'Service';
export type ServiceAggregateType = typeof SERVICE_AGGREGATE_TYPE;

export type ServiceAggregate = ServiceData & Aggregate<ServiceAggregateType>;
