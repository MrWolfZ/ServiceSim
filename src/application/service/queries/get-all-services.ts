import { SERVICE_AGGREGATE_TYPE, ServiceAggregate, ServiceData } from 'src/domain/service';
import { createAndRegisterQueryHandler, Query } from 'src/infrastructure/cqrs';
import {
  getAllPersistedEngineConfigurationAggregates,
} from 'src/infrastructure/persistence/engine-configuration/get-all-persisted-engine-configuration-aggregates';

export interface GetAllServicesQuery extends Query<'get-all-services', ServiceDto[]> { }

export interface ServiceDto extends ServiceData {
  id: string;
}

export const getAllServices = createAndRegisterQueryHandler<GetAllServicesQuery>(
  'get-all-services',
  async () => {
    const allTemplates = await getAllPersistedEngineConfigurationAggregates<ServiceAggregate>(SERVICE_AGGREGATE_TYPE);

    return allTemplates.map<ServiceDto>(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      pathRegex: t.pathRegex,
      operations: [],
    }));
  },
);
