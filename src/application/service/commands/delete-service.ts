import { SERVICE_AGGREGATE_TYPE, ServiceAggregate } from 'src/domain/service';
import { Command, CommandValidationConstraints, createAndRegisterCommandHandler } from 'src/infrastructure/cqrs';
import {
  deletePersistedEngineConfigurationAggregate,
} from 'src/infrastructure/persistence/engine-configuration/delete-persisted-engine-configuration-aggregate';

export interface DeleteServiceCommand extends Command<'delete-service'> {
  serviceId: string;
}

export const updatePredicateNode = createAndRegisterCommandHandler<DeleteServiceCommand>(
  'delete-service',
  async ({ serviceId, commandId }) => {
    await deletePersistedEngineConfigurationAggregate<ServiceAggregate>(
      SERVICE_AGGREGATE_TYPE,
      serviceId,
      commandId,
    );
  },
);

// TODO: validate
export const updatePredicateNodeConstraints: CommandValidationConstraints<DeleteServiceCommand> = {
  serviceId: {},
};
