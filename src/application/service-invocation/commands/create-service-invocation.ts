import { Command, createAndRegisterCommandHandler } from 'src/application/infrastructure/cqrs';
import { ServiceRequest } from 'src/domain/service-invocation';
import { CommandValidationConstraints } from 'src/infrastructure/cqrs';
import { serviceInvocationRepo } from '../service-invocation.repo';

export type CreateServiceInvocationCommandType = 'create-service-invocation';

export interface CreateServiceInvocationCommand extends Command<CreateServiceInvocationCommandType, CreateServiceInvocationCommandResponse> {
  request: ServiceRequest;
}

export interface CreateServiceInvocationCommandResponse {
  invocationId: string;
  invocationVersion: number;
}

export const createServiceInvocation = createAndRegisterCommandHandler<CreateServiceInvocationCommand>(
  'create-service-invocation',
  async command => {
    const newInvocation = await serviceInvocationRepo.create({
      status: 'request is received',
      request: command.request,
      serviceOperationId: undefined,
      response: undefined,
    });

    return {
      invocationId: newInvocation.id,
      invocationVersion: 1,
    };
  },
);

// TODO: validate
export const createServiceInvocationConstraints: CommandValidationConstraints<CreateServiceInvocationCommand> = {
  request: {},
};
