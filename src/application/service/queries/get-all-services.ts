import { SERVICE_AGGREGATE_TYPE, ServiceAggregate } from 'src/domain/service';
import { createAndRegisterQueryHandler, Query } from 'src/infrastructure/cqrs';
import {
  getAllPersistedEngineConfigurationAggregates,
} from 'src/infrastructure/persistence/engine-configuration/get-all-persisted-engine-configuration-aggregates';

export interface GetAllServicesQuery extends Query<'get-all-services', ServiceAggregate[]> { }

export const getAllServices = createAndRegisterQueryHandler<GetAllServicesQuery>(
  'get-all-services',
  async () => {
    return await getAllPersistedEngineConfigurationAggregates<ServiceAggregate>(SERVICE_AGGREGATE_TYPE);
  },
);
