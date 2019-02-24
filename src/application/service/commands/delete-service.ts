import { Command, createAndRegisterCommandHandler } from 'src/application/infrastructure/cqrs';
import { SERVICE_AGGREGATE_TYPE, ServiceAggregate } from 'src/domain/service';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import {
  deletePersistedEngineConfigurationAggregate,
} from 'src/infrastructure/persistence/engine-configuration/delete-persisted-engine-configuration-aggregate';

export interface DeleteServiceCommand extends Command<'delete-service'> {
  serviceId: string;
}

export const updatePredicateNode = createAndRegisterCommandHandler<DeleteServiceCommand>(
  'delete-service',
  async ({ serviceId }) => {
    await deletePersistedEngineConfigurationAggregate<ServiceAggregate>(
      SERVICE_AGGREGATE_TYPE,
      serviceId,
    );
  },
);

// TODO: validate
export const updatePredicateNodeConstraints: CommandValidationConstraints<DeleteServiceCommand> = {
  serviceId: {},
};
