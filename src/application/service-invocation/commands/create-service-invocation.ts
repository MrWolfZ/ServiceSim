import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
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

export async function createServiceInvocationHandler(command: CreateServiceInvocationCommand): Promise<CreateServiceInvocationCommandResponse> {
  const newInvocation = await serviceInvocationRepo.create({
    state: 'processing pending',
    request: command.request,
    response: undefined,
  });

  return {
    invocationId: newInvocation.id,
    invocationVersion: 1,
  };
}

export const createServiceInvocation = createCommandFn<CreateServiceInvocationCommand>('create-service-invocation');

// TODO: validate
export const createServiceInvocationConstraints: CommandValidationConstraints<CreateServiceInvocationCommand> = {
  request: {},
};
