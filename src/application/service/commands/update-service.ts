import { SERVICE_AGGREGATE_TYPE, ServiceAggregate } from 'src/domain/service';
import { Command, CommandValidationConstraints, createAndRegisterCommandHandler } from 'src/infrastructure/cqrs';
import { patchPersistedEngineConfigurationAggregate } from 'src/infrastructure/persistence/engine-configuration/patch-persisted-engine-configuration-aggregate';

export interface UpdateServiceCommand extends Command<'update-service'> {
  serviceId: string;
  name?: string;
  description?: string;
  pathRegex?: string;
}

export const updatePredicateNode = createAndRegisterCommandHandler<UpdateServiceCommand>(
  'update-service',
  async ({ serviceId, name, description, pathRegex }) => {
    await patchPersistedEngineConfigurationAggregate<ServiceAggregate>(
      SERVICE_AGGREGATE_TYPE,
      serviceId,
      {
        name,
        description,
        pathRegex,
      },
    );
  },
);

// TODO: validate
export const updatePredicateNodeConstraints: CommandValidationConstraints<UpdateServiceCommand> = {
  serviceId: {},
  name: {},
  description: {},
  pathRegex: {},
};
