import { Command, createAndRegisterCommandHandler } from 'src/application/infrastructure/cqrs';
import { SERVICE_AGGREGATE_TYPE, ServiceAggregate } from 'src/domain/service';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { persistNewEngineConfigurationAggregate } from 'src/infrastructure/persistence/engine-configuration/persist-new-engine-configuration-aggregate';

export interface CreateServiceCommand extends Command<'create-service', { serviceId: string }> {
  name: string;
  description: string;
  pathRegex: string;
}

export const createService = createAndRegisterCommandHandler<CreateServiceCommand>(
  'create-service',
  async ({ name, description, pathRegex }) => {
    const newService = await persistNewEngineConfigurationAggregate<ServiceAggregate>(SERVICE_AGGREGATE_TYPE)({
      name,
      description,
      pathRegex,
      operations: [],
    });

    return {
      serviceId: newService.id,
    };
  },
);

// TODO: validate
export const createServiceConstraints: CommandValidationConstraints<CreateServiceCommand> = {
  name: {},
  description: {},
  pathRegex: {},
};
