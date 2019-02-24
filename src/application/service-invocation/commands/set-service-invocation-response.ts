import { ServiceResponse } from 'src/domain/service-invocation';
import { Command, CommandValidationConstraints, createCommandFn } from 'src/infrastructure/cqrs';
import { failure } from 'src/util';
import { serviceInvocationRepo } from '../service-invocation.repo';

export type SetServiceInvocationResponseCommandType = 'set-service-invocation-response';

export interface SetServiceInvocationResponseCommand extends Command<SetServiceInvocationResponseCommandType, SetServiceInvocationResponseCommandResponse> {
  invocationId: string;
  unmodifiedInvocationVersion: number;
  response: ServiceResponse;
}

export interface SetServiceInvocationResponseCommandResponse {
  invocationId: string;
  invocationVersion: number;
}

export async function setServiceInvocationResponseHandler(command: SetServiceInvocationResponseCommand): Promise<SetServiceInvocationResponseCommandResponse> {
  const invocation = await serviceInvocationRepo.query.byId(command.invocationId);

  if (invocation.response) {
    throw failure(`Cannot set response for service invocation ${invocation.id} since it already has a response!`);
  }

  const { invocationId, unmodifiedInvocationVersion, response } = command;

  const newVersion = await serviceInvocationRepo.patch(
    invocationId,
    unmodifiedInvocationVersion,
    {},
    serviceInvocationRepo.createDomainEvent('InvocationResponseWasSet', invocationId, response),
  );

  return {
    invocationId: command.invocationId,
    invocationVersion: newVersion,
  };
}

export const setServiceInvocationResponse = createCommandFn<SetServiceInvocationResponseCommand>('set-service-invocation-response');

// TODO: validate
export const setServiceInvocationResponseConstraints: CommandValidationConstraints<SetServiceInvocationResponseCommand> = {
  invocationId: {},
  unmodifiedInvocationVersion: {},
  response: {},
};
